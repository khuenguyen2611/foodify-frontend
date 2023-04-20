import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { FirebaseService } from "../../../shared/service/firebase.service";
import { Router } from "@angular/router";
import { Validation } from "src/app/constants/Validation";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "app-send-email",
  templateUrl: "./send-email.component.html",
  styleUrls: ["./send-email.component.scss"],
})

// @ViewChild('sendMailCompleted') sendMailCompleted: TemplateRef<any>;


export class SendEmailComponent {
  public sendEmailForm: FormGroup;
  public active = 1;

  @ViewChild('sendMailCompleted') sendMailCompleted: TemplateRef<any>

  constructor(
    private formBuilder: UntypedFormBuilder,
    private firebaseService: FirebaseService,
    private modalService: BsModalService,
    private router: Router
  ) {

  }

  layer1: BsModalRef;

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
    this.sendEmailForm = this.formBuilder.group({
      email: new FormControl("", [Validators.required, Validators.email]),
    });
  }

  sendPasswordResetMail() {
    if (this.sendEmailForm.invalid) {
      this.sendEmailForm.markAllAsTouched();
      return;
    }
    this.firebaseService.resetPassword(this.email.value);
    this.layer1 = this.modalService.show(this.sendMailCompleted, { class: "modal-sm" });
  }

  gmail() {
    this.layer1.hide();
    window.location.assign("https://mail.google.com/");
  }

  closeLayer1() {
    this.layer1.hide();
  }

  get email() {
    return this.sendEmailForm.get("email");
  }
}
