import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FirebaseService } from "../../../shared/service/firebase.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Validation } from 'src/app/constants/Validation';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent {
  public resetPasswordForm: FormGroup
  public active = 1;

  // Password
  action: string = '';
  oobCode: string = '';
  showPassword = false;

  //Modal
  layer1: BsModalRef;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private modalService: BsModalService,
    private router: Router
  ) {

  }

  owlcarousel = [
    {
      title: "Chào mừng đến với Foodify",
      desc: "Foodify - Một trong những ứng dụng đặt đồ ăn tốt nhất hiện nay, được phát triển bởi Pyramide team",
    },
    {
      title: "Foodify - xu hướng mới",
      desc: "Với mục đích tạo ra những sản phẩm tốt nhất cho người dùng, chúng mình đã quyết định sử dụng các công nghệ mới nhất vào Foodify",
    },
    {
      title: "Về Pyramide Team",
      desc: "Pyramide team là một nhóm sinh viên trường Đại học FPT, team nghiên cứu và phát triển sản phẩm theo công nghệ Angular và Spring Boot",
    },
  ];
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true,
  };

  ngOnInit() {
    //Get Token from link
    this.oobCode = this.activatedRoute.snapshot.queryParamMap.get('oobCode');
    this.action = this.activatedRoute.snapshot.queryParamMap.get('mode');

    if (this.action == 'verifyEmail') {
      this.firebaseService.confirmVerifyEmail(this.oobCode)
      this.router.navigate(['/auth/email-verified'])
    }

    if (this.oobCode) {
      this.resetPasswordForm = this.formBuilder.group({
        password: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Password)]),
        confirmPassword: new FormControl("", [Validators.required, Validators.pattern(Validation.Regex.Password)]),
      },
        {
          validator: this.ConfirmedValidator("password", "confirmPassword"),
        })
    }
    else {
      this.router.navigate(['/auth/forbidden']);
    }
  }

  //Change password
  changePassword(success: TemplateRef<any>) {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.firebaseService.confirmPasswordReset(this.oobCode, this.password.value);
    this.layer1 = this.modalService.show(success, { class: 'modal-sm' })
  }

  backToLogin() {
    this.layer1.hide();
    this.router.navigate(['/auth/login']);
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

  get password() {
    return this.resetPasswordForm.get("password");
  }

  get confirmPassword() {
    return this.resetPasswordForm.get("confirmPassword");
  }

  // onSignUp() {
  //   this.firebaseAuthService.signUp(this.getSignUpEmail, this.getSignUpPassword);
  // }

  // onSignIn() {
  //   this.firebaseAuthService.signIn(this.getSignInEmail, this.getSignInPassword);
  // }


  // get getSignUpPassword() {
  //   return this.registerForm.get("password").getRawValue();
  // }

  // get getSignInEmail() {
  //   return this.loginForm.get("email").getRawValue();
  // }

  // get getSignInPassword() {
  //   return this.loginForm.get("password").getRawValue();
  // }
}
