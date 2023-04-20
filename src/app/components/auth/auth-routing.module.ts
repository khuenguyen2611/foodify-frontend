import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ForbiddenComponent } from "./forbidden/forbidden.component";
import { SignupComponent } from "./signup/signup.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SendEmailComponent } from "./send-email/send-email.component";
import { EmailVerifiedComponent } from "./email-verified/email-verified.component";

const routes: Routes = [
  // {
  //   path: "login",
  //   component: LoginComponent,
  // },
  // {
  //   path: "forbidden",
  //   component: ForbiddenComponent,
  // },
  // {
  //   path: "signup",
  //   component: SignupComponent,
  // },
  // {
  //   path: "send-email",
  //   component: SendEmailComponent,
  // },
  // {
  //   path: "reset-password",
  //   component: ResetPasswordComponent,
  // },
  // {
  //   path: "email-verified",
  //   component: EmailVerifiedComponent,
  // },
  // {
  //   path: "email-not-verified",
  //   component: EmailVerifiedComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
