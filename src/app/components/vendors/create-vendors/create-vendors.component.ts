import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EMPTY, finalize, switchMap } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { Validation } from 'src/app/constants/Validation';
import { AuthService } from 'src/app/shared/service/auth.service';
import { DistrictService } from 'src/app/shared/service/district.service';
import { FirebaseService } from 'src/app/shared/service/firebase.service';
import { ShopService } from 'src/app/shared/service/shop.service';
import { UserService } from 'src/app/shared/service/user.service';
import { Address } from 'src/app/shared/tables/address';
import { District } from 'src/app/shared/tables/district';
import { Shop } from 'src/app/shared/tables/shop';
import { User } from 'src/app/shared/tables/user';
import { Ward } from 'src/app/shared/tables/ward';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-create-vendors',
    templateUrl: './create-vendors.component.html',
    styleUrls: ['./create-vendors.component.scss']
})
export class CreateVendorsComponent {
    // form
    public active = 1;
    addUserForm: FormGroup;
    passwordForm: FormGroup;
    shopForm: FormGroup;

    // image
    avatar: string;
    shopBanner: string;
    defaultUserImg = environment.userDefaultImg;
    defaultShopImg = environment.shopDefaultImg;


    // file
    downloadURL: Observable<string>;
    userImageFile: File;
    shopImageFile: File;
    imageLink;

    // password
    showPassword = false;

    // address
    isHaveDistrict: boolean;
    district: string = 'none';
    ward: string = 'none';
    validDistrict = true
    validWard = true

    districts: District[];
    wards: Ward[];

    userImageChoosen: boolean = false;
    shopImageChoosen: boolean = false;
    isStudent: boolean = true;

    errorItem = '';
    layer1: BsModalRef;
    layer2: BsModalRef;
    @ViewChild('error_modal') errorModal: TemplateRef<any>;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private districtService: DistrictService,
        private authService: AuthService,
        private storage: AngularFireStorage,
        private shopService: ShopService,
        private modalService: BsModalService,
        private router: Router,
        private firebaseService: FirebaseService
    ) {
        this.createUserForm();
        this.createPasswordForm();
        this.createShopForm();
    }

    createUserForm() {
        this.addUserForm = this.formBuilder.group(
            {
                fullName: new FormControl("", [Validators.required, Validators.minLength(2)]),
                email: new FormControl("", [Validators.required, Validators.email]),
                dateOfBirth: new FormControl("", [Validators.required]),
                phoneNumber: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Phone)]),
                identifiedCode: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.IdentifiedCode)]),
                address: new FormControl("", [Validators.required, Validators.minLength(8)]),
            }
        );
    }

    createPasswordForm() {
        this.passwordForm = this.formBuilder.group({
            password: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Password)]),
            confirmPassword: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Password)]),
        },
            {
                validator: this.ConfirmedValidator("password", "confirmPassword"),
            })
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

    createShopForm() {
        this.shopForm = this.formBuilder.group(
            {
                name: new FormControl("", [Validators.required, Validators.minLength(2)]),
                description: new FormControl("", [Validators.required, Validators.minLength(8)]),
            }
        );
    }

    ngOnInit() {
        this.getAllDistrict();
    }

    /**
     * create User from Form
     */
    createUser(template: TemplateRef<any>): Promise<void> {
        const newUser = new User();
        const newAddress = new Address();
        const newShop = new Shop();

        newUser.fullName = this.userFullName.value;
        newUser.email = this.userEmail.value;
        newUser.dateOfBirth = this.userDateOfBirth.value;
        newUser.phoneNumber = this.userPhoneNumber.value;
        newUser.identifiedCode = this.userIdentifiedCode.value;
        newUser.defaultAddress = 0;
        newUser.isLocked = false;
        newUser.roleName = 'ROLE_SHOP';

        if (this.district === 'none' || this.ward === 'none') {
            this.validDistrict = this.district !== 'none';
            this.validWard = this.ward !== 'none';
        } else {
            // Tiếp tục với quá trình tạo tài khoản
            this.validDistrict = true;
            this.validWard = true;
        }


        if (this.addUserForm.invalid || this.passwordForm.invalid || this.shopForm.invalid || this.district == 'none') {
            this.addUserForm.markAllAsTouched();
            this.passwordForm.markAllAsTouched();
            this.shopForm.markAllAsTouched();
            return Promise.reject();
        }

        newShop.name = this.shopName.value
        newShop.description = this.shopDescription.value;
        newShop.isStudent = this.isStudent;
        newShop.isEnabled = true;
        newShop.lat = '1';
        newShop.lng = '1';


        newAddress.address = this.userAddress.value;
        newAddress.district = this.district;
        if (this.district != "Huyện Hoàng Sa") newAddress.ward = this.ward;

        this.authService.checkEmailOrPhoneNumberExist(newUser).subscribe((error) => {
            if (error.title == 'emailExist') {
                this.errorItem = 'Email';
                this.layer2 = this.modalService.show(this.errorModal, { class: 'modal-sm' });
                return Promise.reject();
            }
            else if (error.title == 'phoneNumExist') {
                this.errorItem = 'Số điện thoại';
                this.layer2 = this.modalService.show(this.errorModal, { class: 'modal-sm' });
                return Promise.reject();
            }
            else {
                if (this.userImageChoosen && this.shopImageChoosen) {
                    this.uploadUserImage(this.userImageFile).then((url) => {
                        newUser.imageUrl = url

                        this.userService.createNewUser(newUser).pipe(
                            switchMap((user) => {
                                this.uploadShopImage(this.shopImageFile).then((url) => {
                                    newShop.userId = user.id
                                    newShop.imageUrl = url;
                                    this.userService.createAddressForUser(user.id, newAddress).subscribe({
                                        next: () => {
                                            this.firebaseService.signUp(newUser.email, this.userPassword.value);
                                            this.shopService.createShop(newShop).subscribe(() => {
                                                this.layer1 = this.modalService.show(template, { class: 'modal-sm' })
                                            })
                                        }
                                    });
                                })
                                return EMPTY; // Return an empty observable to prevent nested subscriptions
                            })
                        ).subscribe({
                            next: () => { },
                            error: () => {
                                this.errorItem = 'CCCD/CMND';
                                this.layer2 = this.modalService.show(this.errorModal, { class: 'modal-sm' });
                            }
                        })
                    })
                }
                else if (this.userImageChoosen && !this.shopImageChoosen) {
                    this.uploadUserImage(this.userImageFile).then((url) => {
                        newUser.imageUrl = url

                        this.userService.createNewUser(newUser).pipe(
                            switchMap((user) => {
                                newShop.userId = user.id
                                newShop.imageUrl = this.defaultShopImg;
                                this.userService.createAddressForUser(user.id, newAddress).subscribe({
                                    next: () => {
                                        this.firebaseService.signUp(newUser.email, this.userPassword.value);
                                        this.shopService.createShop(newShop).subscribe(() => {
                                            this.layer1 = this.modalService.show(template, { class: 'modal-sm' })
                                        })
                                    }
                                });
                                return EMPTY; // Return an empty observable to prevent nested subscriptions
                            })
                        ).subscribe({
                            next: () => { },
                            error: () => {
                                this.errorItem = 'CCCD/CMND';
                                this.layer2 = this.modalService.show(this.errorModal, { class: 'modal-sm' });
                            }
                        })
                    })
                }
                else if (!this.userImageChoosen && this.shopImageChoosen) {
                    newUser.imageUrl = this.defaultUserImg;

                    this.userService.createNewUser(newUser).pipe(
                        switchMap((user) => {
                            this.uploadShopImage(this.shopImageFile).then((url) => {
                                newShop.userId = user.id
                                newShop.imageUrl = url;
                                this.userService.createAddressForUser(user.id, newAddress).subscribe({
                                    next: () => {
                                        this.firebaseService.signUp(newUser.email, this.userPassword.value);
                                        this.shopService.createShop(newShop).subscribe(() => {
                                            this.layer1 = this.modalService.show(template, { class: 'modal-sm' })
                                        })
                                    }
                                });
                            })
                            return EMPTY; // Return an empty observable to prevent nested subscriptions
                        })
                    ).subscribe({
                        next: () => { },
                        error: () => {
                            this.errorItem = 'CCCD/CMND';
                            this.layer2 = this.modalService.show(this.errorModal, { class: 'modal-sm' });
                        }
                    })
                }
                else {
                    newUser.imageUrl = this.defaultUserImg;

                    this.userService.createNewUser(newUser).pipe(
                        switchMap((user) => {
                            newShop.userId = user.id
                            newShop.imageUrl = this.defaultShopImg;
                            this.userService.createAddressForUser(user.id, newAddress).subscribe({
                                next: () => {
                                    this.firebaseService.signUp(newUser.email, this.userPassword.value);
                                    this.shopService.createShop(newShop).subscribe(() => {
                                        this.layer1 = this.modalService.show(template, { class: 'modal-sm' })
                                    })
                                }
                            });
                            return EMPTY; // Return an empty observable to prevent nested subscriptions
                        })
                    ).subscribe({
                        next: () => { },
                        error: () => {
                            this.errorItem = 'CCCD/CMND';
                            this.layer2 = this.modalService.show(this.errorModal, { class: 'modal-sm' });
                        }
                    })
                }
            }
        })
    }

    //Districts and Wards
    getAllDistrict() {
        this.districtService.getAllDistricts().subscribe((distrs) => {
            this.districts = distrs;
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

    swap() {
        if (this.isStudent) {
            this.isStudent = false
        }
        else {
            this.isStudent = true;
        }
    }

    //Image Selected
    onFileSelected(event) {
        this.userImageChoosen = true;
        this.userImageFile = event.target.files[0];

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

    //Shop Image Selected
    onShopFileSelected(event) {
        this.shopImageChoosen = true;
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

    chooseImg(template: TemplateRef<any>) {
        this.layer1 = this.modalService.show(template, { class: 'modal-sm' });
    }

    continue() {
        this.layer1.hide();
        this.router.navigate(['/vendors/list']);
    }

    closeLayer2() {
        this.layer2.hide();
    }

    //Getter
    get image() { return this.addUserForm.get("image") }
    get userFullName() { return this.addUserForm.get("fullName") }
    get userEmail() { return this.addUserForm.get("email") }
    get userDateOfBirth() { return this.addUserForm.get("dateOfBirth") }
    get userPhoneNumber() { return this.addUserForm.get("phoneNumber") }
    get userIdentifiedCode() { return this.addUserForm.get("identifiedCode") }
    get userAddress() { return this.addUserForm.get("address") }
    get userDistrict() { return this.addUserForm.get("district") }
    get userWard() { return this.addUserForm.get("ward") }

    get userPassword() { return this.passwordForm.get("password") }
    get userConfirmPassword() { return this.passwordForm.get("confirmPassword") }

    //Shop
    get banner() { return this.shopForm.get("banner") }
    get shopName() { return this.shopForm.get("name") }
    get shopDescription() { return this.shopForm.get("description") }
}
