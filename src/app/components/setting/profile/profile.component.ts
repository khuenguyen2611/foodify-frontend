import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/service/user.service';
import { User } from 'src/app/shared/tables/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public active = 1;
  loggedId: number = Number(localStorage.getItem('user-id'))
  user: User;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUserById(this.loggedId).subscribe((user) => {
      this.user = user;
    })
  }

}
