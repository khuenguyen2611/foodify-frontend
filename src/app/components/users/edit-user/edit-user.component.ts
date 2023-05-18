import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StringLike } from '@firebase/util';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { Validation } from 'src/app/constants/Validation';
import { AddressService } from 'src/app/shared/service/address.service';
import { DistrictService } from 'src/app/shared/service/district.service';
import { FirebaseService } from 'src/app/shared/service/firebase.service';
import { UserService } from 'src/app/shared/service/user.service';
import { Address } from 'src/app/shared/tables/address';
import { District } from 'src/app/shared/tables/district';
import { User } from 'src/app/shared/tables/user';
import { Ward } from 'src/app/shared/tables/ward';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  //Form
  userId: number;
  user: User;
  oldImg: string;
  active = 1;
  isLocked: boolean;
  editingAddressId: number;

  // image
  avatar: string;
  edited: boolean = false;

  // file
  downloadURL: Observable<string>;
  userImageFile: File;
  shopImageFile: File;
  imageLink;

  editUserForm: FormGroup;
  newAddressForm: FormGroup;
  districts: District[] = [];
  wards: Ward[] = [];

  //District and Ward model
  district: string;
  ward: string;

  //Validate
  isHaveDistrict: boolean = false;

  //ViewChild
  @ViewChild('confirmDefault') confirmDefault: TemplateRef<any>;
  @ViewChild('changeDefaultSuccess') changeDefaultSuccess: TemplateRef<any>;

  constructor(
    private addressService: AddressService,
    private userService: UserService,
    private modalService: BsModalService,
    private districtService: DistrictService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService
  ) {

  }

  ngOnInit(): void {
    const userId = +this.route.snapshot.paramMap.get('id');
    this.getAllDistrict().then(() => {
      this.userService.getUserById(userId).subscribe((user) => this.loadFormData(user))
    })
    this.createEditUserForm();
  }

  reload() {
    const userId = +this.route.snapshot.paramMap.get('id');
    this.userService.getUserById(userId).subscribe((user) => this.loadFormData(user))
  }

  loadFormData(user: User) {
    //Out Form
    this.user = user;
    this.userId = user.id;
    this.isLocked = user.isLocked;
    this.oldImg = user.imageUrl;

    //In Form
    this.editUserForm.patchValue({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dob: user.dateOfBirth,
      identifiedCode: user.identifiedCode
    });
  }

  //Create Forms
  createEditUserForm() {
    this.editUserForm = this.formBuilder.group({
      fullName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phoneNumber: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Phone)]),
      dob: new FormControl("", [Validators.required]),
      identifiedCode: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.IdentifiedCode)]),
    })
  }

  createAddressForm() {
    this.newAddressForm = this.formBuilder.group({
      address: [''],
      district: [''],
      ward: [''],
    })
  }

  //Functions
  editUser(template: TemplateRef<any>) {
    const editUser = new User();
    editUser.fullName = this.userFullName.value;
    editUser.email = this.userEmail.value;
    editUser.phoneNumber = this.userPhoneNumber.value;
    editUser.dateOfBirth = this.userDateOfBirth.value;
    editUser.identifiedCode = this.userIdentifiedCode.value;
    editUser.defaultAddress = this.user.defaultAddress;
    editUser.isLocked = this.isLocked;
    editUser.roleName = 'ROLE_USER';

    if (this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      return;
    }

    if (this.edited) {
      this.uploadUserImage(this.userImageFile).then((url) => {
        editUser.imageUrl = url;
        this.userService.updateUser(this.userId, editUser).subscribe(() => {
          this.layer1 = this.modalService.show(template, { class: 'modal-sm' });
        });
      })
    } else {
      editUser.imageUrl = this.user.imageUrl;
      this.userService.updateUser(this.userId, editUser).subscribe(() => {
        this.layer1 = this.modalService.show(template, { class: 'modal-sm' });
      });
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

  onDistrictSelected() {
    this.isHaveDistrict = false;
    this.wards = [];

    this.districts.forEach((element: District) => {
      if (this.district == element.name && this.district != 'Huyện Hoàng Sa') {
        this.isHaveDistrict = true;
        this.wards = element.wards
      }

      if (this.userDistrict == element.name && this.userDistrict != 'Huyện Hoàng Sa') {
        this.isHaveDistrict = true;
        this.wards = element.wards
      }
    });
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
    this.layer1.hide();
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

  //Modal
  layer1: BsModalRef;
  layer2: BsModalRef;

  chooseImg(template: TemplateRef<any>) {
    this.layer1 = this.modalService.show(template, { class: 'modal-sm' });
  }

  openAddressForm(addForm: TemplateRef<any>) {
    this.createAddressForm();
    this.layer1 = this.modalService.show(addForm, { class: 'modal-sm' });
  }

  async openEditAddress(id: number, template: TemplateRef<any>) {
    this.editingAddressId = id;
    await this.createAddressForm();
    await this.patchAddressById(id);

    this.layer1 = this.modalService.show(template, { class: 'modal-sm' });
  }

  addNewAddress(success: TemplateRef<any>, failure: TemplateRef<any>) {
    const newAddress = new Address();
    newAddress.address = this.userAddress;
    newAddress.district = this.userDistrict;
    newAddress.ward = this.userWard;

    this.userService.createAddressForUser(this.user.id, newAddress).subscribe(
      (response) => {
        if (response.title == 'Address has existed') {
          this.layer2 = this.modalService.show(failure, { class: 'modal-sm' })
        }
        else {
          this.layer2 = this.modalService.show(success, { class: 'modal-sm' })
        }
      }
    )
  }

  editAddress(success: TemplateRef<any>, failure: TemplateRef<any>) {
    const editAddress = new Address();
    editAddress.address = this.userAddress;
    editAddress.district = this.district;
    editAddress.ward = this.ward;

    this.userService.updateUserAddress(this.user.id, this.editingAddressId, editAddress).subscribe(
      (response) => {
        if (this.user.defaultAddress == this.editingAddressId) {
          this.userService.updateUserDefaultAddress(this.user.id, response.id).subscribe()
        }
        this.layer2 = this.modalService.show(success, { class: 'modal-sm' })
      },
      (error) => {
        this.layer2 = this.modalService.show(failure, { class: 'modal-sm' })
      }
    )
  }

  openChangeModal(id: number) {
    this.editingAddressId = id;
    this.layer1 = this.modalService.show(this.confirmDefault, { class: 'modal-sm' })
  }

  changeDefaultAddress() {
    this.layer1.hide()
    this.userService.updateUserDefaultAddress(this.user.id, this.editingAddressId).subscribe({
      next: () => {
        this.layer1 = this.modalService.show(this.changeDefaultSuccess, { class: 'modal-sm' })
      }
    })
  }

  patchAddressById(id: number) {
    this.addressService.getAddressById(id).subscribe((address) => {
      this.district = address.district;
      this.onDistrictSelected()
      this.ward = address.ward;
      this.newAddressForm.patchValue({
        address: address.address
      })
    })
  }

  continue() {
    this.layer1.hide();
  }

  closeLayer1() {
    this.reload();
    this.layer1.hide();
  }

  closeLayer2() {
    this.layer2.hide();
  }

  swapLocked() {
    if (this.isLocked) {
      this.isLocked = false
    }
    else {
      this.isLocked = true;
    }
  }

  //Delete modal
  openDeleteModal(addressId: number, confirmDelete: TemplateRef<any>) {
    this.editingAddressId = addressId;
    this.layer1 = this.modalService.show(confirmDelete, { class: 'modal-sm' })
  }

  confirmDeleted(deleteSuccess: TemplateRef<any>) {
    this.layer1.hide();
    this.userService.deleteUserAddress(this.user.id, this.editingAddressId).subscribe(() => {
      this.layer1 = this.modalService.show(deleteSuccess, { class: 'modal-sm' })
    })
  }

  //Firebase modal
  openResetPassword(email: string) {
    this.firebaseService.resetPassword(email);
  }

  //getter
  get userFullName() { return this.editUserForm.get('fullName') }
  get userEmail() { return this.editUserForm.get("email") }
  get userDateOfBirth() { return this.editUserForm.get("dob") }
  get userPhoneNumber() { return this.editUserForm.get("phoneNumber") }
  get userIdentifiedCode() { return this.editUserForm.get("identifiedCode") }

  get userAddress() { return this.newAddressForm.get('address').value; }
  get userDistrict() { return this.newAddressForm.get('district').value; }
  get userWard() { return this.newAddressForm.get('ward').value; }
}
