import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NavService } from '../../service/nav.service';
import { User } from '../../tables/user';
import { UserService } from '../../service/user.service';
import { FirebaseService } from '../../service/firebase.service';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public isOpenMobile: boolean;
  public user: User;
  isMobileNavOpen: boolean = false;

  //Log-in
  token: string = localStorage.getItem("jwt-token");
  isShop: boolean = false;
  loggedId: number;
  loggedRole: string;
  shopId: number;

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(
    public navServices: NavService,
    private userService: UserService,
    private firebaseService: FirebaseService) {

  }

  collapseSidebar() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar
  }
  right_side_bar() {
    this.right_sidebar = !this.right_sidebar
    this.rightSidebarEvent.emit(this.right_sidebar)
  }

  openMobileNav() {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }


  ngOnInit() {
    this.userService.getUserByToken(this.token).subscribe((userInfo) => {
      this.loggedId = userInfo.userId;
      this.loggedRole = userInfo.userRole;

      if (this.loggedRole != 'ROLE_ADMIN') {
        this.isShop = true;
        this.shopId = userInfo.shopId;
      }
      this.userService.getUserById(userInfo.userId).subscribe((user) => {
        this.user = user;
      })
    })
  }

  logOut() {
    this.firebaseService.logout();
  }

}