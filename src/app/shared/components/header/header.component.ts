import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NavService } from '../../service/nav.service';
import { User } from '../../tables/user';
import { UserService } from '../../service/user.service';
import { FirebaseService } from '../../service/firebase.service';

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

  //Log-in
  isShop: boolean = false;
  loggedId: number = Number(localStorage.getItem('user-id'))
  loggedRole = localStorage.getItem('user-role');
  shopId: number;

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(
    public navServices: NavService,
    private userService: UserService,
    private firebaseService: FirebaseService) {
    this.userService.getUserById(Number(localStorage.getItem('user-id'))).subscribe((user) => {
      this.user = user;
    })
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
    this.openNav = !this.openNav;
  }


  ngOnInit() {
    if (this.loggedRole != 'ROLE_ADMIN') {
      this.isShop = true;
      this.shopId = Number(localStorage.getItem('shop-id'))
    }
  }

  logOut() {
    this.firebaseService.logout();
  }

}