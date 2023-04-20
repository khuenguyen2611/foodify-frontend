import { Component } from '@angular/core';

@Component({
  selector: 'app-email-not-verified',
  templateUrl: './email-not-verified.component.html',
  styleUrls: ['./email-not-verified.component.scss']
})
export class EmailNotVerifiedComponent {
  goToGmail() {
    window.location.assign("https://mail.google.com/");
  }
}
