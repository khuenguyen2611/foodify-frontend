import { Component, OnInit } from '@angular/core';
import { userInfo } from 'os';
import { UserService } from 'src/app/shared/service/user.service';
import { User } from 'src/app/shared/tables/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public active = 1;
  token: string = localStorage.getItem("jwt-token");
  user: User;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUserByToken(this.token).subscribe(userInfo => {
      this.userService.getUserById(userInfo.userId).subscribe((user) => {
        this.user = user;
      })
    })
  }

}
