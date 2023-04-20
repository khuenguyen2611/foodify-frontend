import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EMPTY, finalize, switchMap } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { DistrictService } from 'src/app/shared/service/district.service';
import { GoogleService } from 'src/app/shared/service/google.service';
import { ShopService } from 'src/app/shared/service/shop.service';
import { UserService } from 'src/app/shared/service/user.service';
import { Address } from 'src/app/shared/tables/address';
import { District } from 'src/app/shared/tables/district';
import { Shop } from 'src/app/shared/tables/shop';
import { User } from 'src/app/shared/tables/user';
import { Ward } from 'src/app/shared/tables/ward';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {
  roleName = localStorage.getItem('user-role');

  //ids
  userId: number;
  shopId: number;
  addressId: number;

  // form
  public active = 1;
  editUserForm: FormGroup;
  editShopForm: FormGroup;


  // image
  avatar: string;
  shopBanner: string;

  // file
  downloadURL: Observable<string>;
  userImageFile: File;
  shopImageFile: File;
  imageLink;

  // password
  showPassword = false;

  // address
  isHaveDistrict: boolean;
  district: string;
  ward: string;
  districts: District[];
  wards: Ward[] = [];

  //Shop
  isStudent: boolean = true;
  isEnabled: boolean = true;
  userImg: string;
  shopImg: string;
  edited: boolean = false;
  shopEdited: boolean = false;

  //location
  oldAddress: string;
  oldDistrict: string;
  oldWard: string;
  oldLat: string;
  oldLng: string;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private shopService: ShopService,
    private districtService: DistrictService,
    private googleService: GoogleService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {
    this.createUserForm();
    this.createEditShopForm();
  }

  ngOnInit() {
    const shopId = +this.route.snapshot.paramMap.get('id')!;
    this.getAllDistrict().then(() => {
      this.shopService.getShopById(shopId).subscribe((data => this.fillFormToUpdate(data)))
    }).catch(error => { });
  }

  createUserForm() {
    this.editUserForm = this.formBuilder.group(
      {
        fullName: new FormControl("", [Validators.required]),
        email: new FormControl("", [Validators.required, Validators.email]),
        dateOfBirth: new FormControl("", [Validators.required]),
        phoneNumber: new FormControl("", [Validators.required]),
        identifiedCode: new FormControl("", [Validators.required]),
        address: new FormControl("", [Validators.required]),
        // district: new FormControl("", [Validators.required]),
        // ward: new FormControl("", [Validators.required]),
        // password: new FormControl("", [Validators.required]),
        // confirmPassword: new FormControl("", [Validators.required]),
      }
    );
  }

  createEditShopForm() {
    this.editShopForm = this.formBuilder.group(
      {
        name: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
        image: new FormControl(""),
      }
    );
  }

  fillFormToUpdate(response: Shop) {
    this.isHaveDistrict = false;
    this.isEnabled = response.isEnabled;
    this.userImg = response.user.imageUrl;
    this.shopImg = response.imageUrl;
    this.userId = response.user.id;
    this.shopId = response.id;
    this.addressId = response.user.addresses[0].id;
    this.district = response.user.addresses[0].district;
    this.ward = response.user.addresses[0].ward;

    //old location
    this.oldLat = response.lat;
    this.oldLng = response.lng;
    this.oldAddress = response.user.addresses[0].address;
    this.oldDistrict = response.user.addresses[0].district;
    this.oldWard = response.user.addresses[0].ward;

    this.districts.forEach((element: District) => {
      if (response.user.addresses[0].district == element.name && response.user.addresses[0].district != "Huyện Hoàng Sa") {
        this.isHaveDistrict = true;
        this.wards = element.wards
      }
    })

    this.editUserForm.patchValue({
      fullName: response.user.fullName,
      email: response.user.email,
      dateOfBirth: response.user.dateOfBirth,
      phoneNumber: response.user.phoneNumber,
      identifiedCode: response.user.identifiedCode,
      address: response.user.addresses[0].address
    })

    this.editShopForm.patchValue({
      name: response.name,
      description: response.description
    })
  }

  onDistrictSelected() {
    this.isHaveDistrict = false;

    this.districts.forEach((element: District) => {
      if (this.district == element.name && this.district != 'Huyện Hoàng Sa') {
        this.isHaveDistrict = true;
        this.wards = element.wards
      }
    });
  }

  //Edit vendor
  editUser(template: TemplateRef<any>) {
    const editUser = new User();
    const editAddress = new Address();
    const editShop = new Shop();

    editUser.fullName = this.userFullName.value;
    editUser.email = this.userEmail.value;
    editUser.dateOfBirth = this.userDateOfBirth.value;
    editUser.phoneNumber = this.userPhoneNumber.value;
    editUser.identifiedCode = this.userIdentifiedCode.value;
    editUser.defaultAddress = 0;
    editUser.isLocked = false;
    editUser.roleName = 'ROLE_SHOP';

    editAddress.id = this.addressId;
    editAddress.address = this.userAddress.value;
    editAddress.district = this.district;
    if (this.district != "Huyện Hoàng Sa") editAddress.ward = this.ward;

    editShop.name = this.shopName.value
    editShop.description = this.shopDescription.value;
    editShop.isStudent = this.isStudent;
    editShop.isEnabled = this.isEnabled;


    if (this.editUserForm.invalid || this.editShopForm.invalid) {
      this.editUserForm.markAllAsTouched();
      this.editShopForm.markAllAsTouched();
      return;
    }

    if (this.oldAddress == editAddress.address && this.oldDistrict == editAddress.district && this.oldWard == editAddress.ward) {
      editShop.lat = this.oldLat;
      editShop.lng = this.oldLng;

      if (this.edited == true && this.shopEdited == true) {
        this.uploadUserImage(this.userImageFile).then((url) => {
          editUser.imageUrl = url
          this.userService.updateUser(this.userId, editUser).pipe(
            switchMap((user) => {
              this.uploadShopImage(this.shopImageFile).then((url) => {
                editShop.imageUrl = url;
                this.shopService.updateShop(this.shopId, editShop).subscribe();
                this.userService.updateUserAddress(this.userId, this.addressId, editAddress).subscribe(
                  () => { this.modalRef = this.modalService.show(template, { class: 'modal-sm' }); },
                  (error) => {
                    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
                  });
              })
              return EMPTY;
            })
          ).subscribe(() => {

          });
        })
      } else if (this.edited && !this.shopEdited) {
        this.uploadUserImage(this.userImageFile).then((url) => {
          editUser.imageUrl = url;
          editShop.imageUrl = this.shopImg;
          this.userService.updateUser(this.userId, editUser).subscribe();
          this.shopService.updateShop(this.shopId, editShop).subscribe();
          this.userService.updateUserAddress(this.userId, this.addressId, editAddress).subscribe(
            () => { this.modalRef = this.modalService.show(template, { class: 'modal-sm' }); },
            (error) => {
              this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
            }
          )
        })
      } else if (!this.edited && this.shopEdited) {
        this.uploadShopImage(this.shopImageFile).then((url) => {
          editUser.imageUrl = this.userImg;
          editShop.imageUrl = url;
          this.userService.updateUser(this.userId, editUser).subscribe();
          this.shopService.updateShop(this.shopId, editShop).subscribe();
          this.userService.updateUserAddress(this.userId, this.addressId, editAddress).subscribe(
            () => { this.modalRef = this.modalService.show(template, { class: 'modal-sm' }); },
            (error) => {
              this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
            }
          )
        })
      } else {
        editUser.imageUrl = this.userImg;
        editShop.imageUrl = this.shopImg;
        this.userService.updateUser(this.userId, editUser).subscribe();
        this.shopService.updateShop(this.shopId, editShop).subscribe();
        this.userService.updateUserAddress(this.userId, this.addressId, editAddress).subscribe(
          () => { this.modalRef = this.modalService.show(template, { class: 'modal-sm' }); },
          (error) => {
            this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
          }
        )
      }
    }
    else {
      const newAddress = `${editAddress.address}, ${editAddress.ward}, ${editAddress.district}, Đà Nẵng`;
      this.googleService.getLocation(newAddress).subscribe((location) => {
        editShop.lat = location.lat;
        editShop.lng = location.lng;

        if (this.edited == true && this.shopEdited == true) {
          this.uploadUserImage(this.userImageFile).then((url) => {
            editUser.imageUrl = url
            this.userService.updateUser(this.userId, editUser).pipe(
              switchMap((user) => {
                this.uploadShopImage(this.shopImageFile).then((url) => {
                  editShop.imageUrl = url;
                  this.shopService.updateShop(this.shopId, editShop).subscribe();
                  this.userService.updateUserAddress(this.userId, this.addressId, editAddress).subscribe(
                    () => { this.modalRef = this.modalService.show(template, { class: 'modal-sm' }); },
                    (error) => {
                      this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
                    });
                })
                return EMPTY;
              })
            ).subscribe(() => {

            });
          })
        } else if (this.edited && !this.shopEdited) {
          this.uploadUserImage(this.userImageFile).then((url) => {
            editUser.imageUrl = url;
            editShop.imageUrl = this.shopImg;
            this.userService.updateUser(this.userId, editUser).subscribe();
            this.shopService.updateShop(this.shopId, editShop).subscribe();
            this.userService.updateUserAddress(this.userId, this.addressId, editAddress).subscribe(
              () => { this.modalRef = this.modalService.show(template, { class: 'modal-sm' }); },
              (error) => {
                this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
              }
            )
          })
        } else if (!this.edited && this.shopEdited) {
          this.uploadShopImage(this.shopImageFile).then((url) => {
            editUser.imageUrl = this.userImg;
            editShop.imageUrl = url;
            this.userService.updateUser(this.userId, editUser).subscribe();
            this.shopService.updateShop(this.shopId, editShop).subscribe();
            this.userService.updateUserAddress(this.userId, this.addressId, editAddress).subscribe(
              () => { this.modalRef = this.modalService.show(template, { class: 'modal-sm' }); },
              (error) => {
                this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
              }
            )
          })
        } else {
          editUser.imageUrl = this.userImg;
          editShop.imageUrl = this.shopImg;
          this.userService.updateUser(this.userId, editUser).subscribe();
          this.shopService.updateShop(this.shopId, editShop).subscribe();
          this.userService.updateUserAddress(this.userId, this.addressId, editAddress).subscribe(
            () => { this.modalRef = this.modalService.show(template, { class: 'modal-sm' }); },
            (error) => {
              this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
            }
          )
        }
      })
    }

  }

  //Districts
  getAllDistrict(): Promise<void> {
    return new Promise((resolve, rejects) => {
      this.districtService.getAllDistricts().subscribe(
        (distrc) => {
          this.districts = distrc;
          resolve();
        }
      )
    })
  }

  //Image
  onFileSelected(event) {
    this.edited = true;
    this.userImageFile = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file)

      reader.onload = () => {
        this.avatar = reader.result as string;
        localStorage.setItem("image", this.avatar);
      }
    }
    this.modalRef.hide();
  }

  //Shop Image
  onShopFileSelected(event) {
    this.shopEdited = true;
    this.shopImageFile = event.target.files[0];
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file)

      reader.onload = () => {
        this.shopBanner = reader.result as string;
        localStorage.setItem("image", this.shopBanner);
      }
    }
    this.modalRef.hide();
  }

  uploadUserImage(fileUpload: File): Promise<string> {
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

        }
        );
    })
  }

  uploadShopImage(fileUpload: File): Promise<string> {
    return new Promise<string>((resolve) => {
      let n = Date.now();
      const filePath = `Shops/${n}`;

      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`Shops/${n}`, fileUpload);
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

        }
        );
    })
  }

  swap() {
    if (this.isStudent) {
      this.isStudent = false
    }
    else {
      this.isStudent = true;
    }
  }

  swapEnabled() {
    if (this.isEnabled) {
      this.isEnabled = false
    }
    else {
      this.isEnabled = true;
    }
  }

  //Modal
  modalRef: BsModalRef;

  chooseImg(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  continue() {
    this.modalRef.hide();
    this.router.navigate(['/vendors/details', this.shopId]);
  }

  //Getter
  get userFullName() { return this.editUserForm.get("fullName") }
  get userEmail() { return this.editUserForm.get("email") }
  get userDateOfBirth() { return this.editUserForm.get("dateOfBirth") }
  get userPhoneNumber() { return this.editUserForm.get("phoneNumber") }
  get userIdentifiedCode() { return this.editUserForm.get("identifiedCode") }
  get userAddress() { return this.editUserForm.get("address") }
  // get userDistrict() { return this.editUserForm.get("district").value; }
  // get userWard() { return this.editUserForm.get("ward").value; }
  get userPassword() { return this.editUserForm.get("password").value; }
  get userConfirmPassword() { return this.editUserForm.get("confirmPassword").value; }

  //Shop
  get shopName() { return this.editShopForm.get("name") }
  get shopDescription() { return this.editShopForm.get("description") }
}