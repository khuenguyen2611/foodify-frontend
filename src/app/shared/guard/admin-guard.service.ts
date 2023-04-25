import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseService } from '../service/firebase.service';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  token: string = localStorage.getItem('jwt-token');
  role: string;

  constructor(
    private firebaseService: FirebaseService,
    private userService: UserService,
    private router: Router
  ) {
    this.userService.getUserByToken(this.token).subscribe((userInfo) => {
      this.role = userInfo.userRole;
    })
  }

  canActivate(): boolean {
    if (this.role == 'ROLE_ADMIN') {
      return true;
    }
    else {
      this.router.navigate(['/dashboard/default']);
      return false;
    }
  }
}
