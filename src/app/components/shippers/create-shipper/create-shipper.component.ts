import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { rejects } from 'assert';
import { url } from 'inspector';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { resolve } from 'path';
import { finalize, mergeMap, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs-compat/operator/switchMap';
import { Validation } from 'src/app/constants/Validation';
import { AuthService } from 'src/app/shared/service/auth.service';
import { FirebaseService } from 'src/app/shared/service/firebase.service';
import { ShipperService } from 'src/app/shared/service/shipper.service';
import { UserService } from 'src/app/shared/service/user.service';
import { Shipper } from 'src/app/shared/tables/shipper';
import { User } from 'src/app/shared/tables/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-shipper',
  templateUrl: './create-shipper.component.html',
  styleUrls: ['./create-shipper.component.scss']
})
export class CreateShipperComponent implements OnInit {
  public accountForm: FormGroup;
  public permissionForm: UntypedFormGroup;
  public active = 1;

  //Log-in
  isShop: boolean = false;
  loggedId: number = Number(localStorage.getItem('user-id'))
  loggedRole = localStorage.getItem('user-role');
  shopId: number;

  imageFile: File;
  downloadURL: Observable<string>;
  avatar: string;
  edited: boolean = false;
  defaultUserImg = environment.userDefaultImg;

  // Password
  showPassword = false;

  failureContent: string = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private storage: AngularFireStorage,
    private userService: UserService,
    private shipperService: ShipperService,
    private router: Router,
    private modalService: BsModalService,
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {
    this.createPermissionForm();
  }



  createPermissionForm() {
    this.permissionForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.accountForm = this.formBuilder.group(
      {
        // url: new FormControl("", [Validators.required]),
        fullName: new FormControl("", [Validators.required, Validators.minLength(2)]),
        email: new FormControl("", [Validators.required, Validators.email]),
        dob: new FormControl("", [Validators.required]),
        phoneNumber: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Phone)]),
        identifiedCode: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.IdentifiedCode)]),
        defaultAddress: new FormControl(""),
        password: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Password)]),
        confirmPassword: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Password)]),
        isLocked: new FormControl(false, [Validators.required]),
        roleName: new FormControl("ROLE_SHIPPER", [Validators.required]),
        shopId: new FormControl("", [Validators.required]),
      },
      {
        validator: this.ConfirmedValidator("password", "confirmPassword"),
      }
    );

    if (this.loggedRole != 'ROLE_ADMIN') {
      this.isShop = true;
      this.shopId = Number(localStorage.getItem('shop-id'))
      this.accountForm.patchValue({
        shopId: this.shopId
      })
    }
  }

  // Validation for password and confirm password
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  createShipper(failure: TemplateRef<any>): Promise<void> {

    // Check all validations addUserForm
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return Promise.reject('Invalid form');
    }

    const newUser = new User()
    const newShipper = new Shipper();
    newUser.fullName = this.shipperFullName.value;
    newUser.dateOfBirth = this.shipperDob.value;
    newUser.email = this.shipperEmail.value;
    newUser.phoneNumber = this.shipperPhoneNumber.value;
    newUser.identifiedCode = this.shipperIdentifiedCode.value;
    newUser.isLocked = false;
    newUser.defaultAddress = 0;
    newUser.roleName = 'ROLE_SHIPPER'

    this.authService.checkEmailOrPhoneNumberExist(newUser).subscribe((result) => {
      if (result.title == 'emailExist') {
        this.failureContent = 'Email'
        this.layer1 = this.modalService.show(failure, { class: 'modal-sm' });
        return Promise.reject();
      }
      else if (result.title == 'phoneNumExist') {
        this.failureContent = 'Số điện thoại'
        this.layer1 = this.modalService.show(failure, { class: 'modal-sm' });
        return Promise.reject();
      }
    })

    return new Promise((resolve, rejects) => {
      if (this.edited) {
        this.uploadImage(this.imageFile).then((url) => {
          newUser.imageUrl = url;
          this.userService.createNewUser(newUser).pipe(
            mergeMap((user) => {
              newShipper.userId = user.id
              if (this.isShop) {
                newShipper.shopId = this.shopId;
              }
              else {
                newShipper.shopId = this.shipperShopId.value
              }
              return this.shipperService.createShipper(newShipper)
            })).subscribe({
              next: (shipper) => {
                of(this.firebaseService.signUp(newUser.email, this.shipperPassword.value)).subscribe({
                  next: () => {
                    this.router.navigate(["shippers/list"]);
                  }
                });
              },
              error: () => {
                this.failureContent = 'CCCD/CMND'
                this.layer1 = this.modalService.show(failure, { class: 'modal-sm' });
              }
            });
          resolve();
        })
      }
      else {
        newUser.imageUrl = this.defaultUserImg;
        this.userService.createNewUser(newUser).pipe(
          mergeMap((user) => {
            newShipper.userId = user.id
            if (this.isShop) {
              newShipper.shopId = this.shopId;
            }
            else {
              newShipper.shopId = this.shipperShopId.value
            }
            return this.shipperService.createShipper(newShipper)
          })).subscribe({
            next: (shipper) => {
              of(this.firebaseService.signUp(newUser.email, this.shipperPassword.value)).subscribe({
                next: () => {
                  this.router.navigate(["shippers/list"]);
                }
              });
            },
            error: () => {
              this.failureContent = 'CCCD/CMND'
              this.layer1 = this.modalService.show(failure, { class: 'modal-sm' });
            }
          });
      }
    })
  }

  //Image
  onFileSelected(event) {
    this.edited = true;
    this.imageFile = event.target.files[0];
  }

  onFileChange(event) {
    this.edited = true;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.avatar = reader.result as string;
        localStorage.setItem("image", this.avatar);
      };
    }
    this.imageFile = event.target.files[0];
    this.layer1.hide()
  }

  uploadImage(fileUpload: File): Promise<string> {
    return new Promise<string>((resolve) => {
      let n = Date.now();
      const filePath = `UserImages/${n}`;

      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`UserImages/${n}`, fileUpload);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                resolve(url);
              }
            });
          })
        )
        .subscribe(url => {
          // if (url) {
          // }
        }
        );
    })
  }

  layer1: BsModalRef

  chooseImg(template: TemplateRef<any>) {
    this.layer1 = this.modalService.show(template, { class: 'modal-sm' });
  }

  closeLayer1() {
    this.layer1.hide();
  }

  //Getter
  get url() { return this.accountForm.get('url').value }

  get shipperFullName() { return this.accountForm.get('fullName') }

  get shipperDob() { return this.accountForm.get('dob') }

  get shipperEmail() { return this.accountForm.get('email') }

  get shipperPhoneNumber() { return this.accountForm.get('phoneNumber') }

  get shipperIdentifiedCode() { return this.accountForm.get('identifiedCode') }

  get shipperPassword() { return this.accountForm.get('password') }

  get shipperConfirmPassword() { return this.accountForm.get('confirmPassword') }

  get shipperShopId() { return this.accountForm.get('shopId') }
}
