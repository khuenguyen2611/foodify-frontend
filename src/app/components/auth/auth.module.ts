import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { environment } from "../../../environments/environment";
import firebase from 'firebase/compat/app';

import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CarouselModule } from "ngx-owl-carousel-o";
import { SharedModule } from "../../shared/shared.module";
import { ForbiddenComponent } from "./forbidden/forbidden.component";
import { SignupComponent } from "./signup/signup.component";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { EmailVerifiedComponent } from './email-verified/email-verified.component';
import { EmailNotVerifiedComponent } from './email-not-verified/email-not-verified.component';

firebase.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [LoginComponent, SignupComponent, ForbiddenComponent, ResetPasswordComponent, SendEmailComponent, EmailVerifiedComponent, EmailNotVerifiedComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    CarouselModule,
    SharedModule,
    NgbModule,
    FormsModule]
})
export class AuthModule { }
