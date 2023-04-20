import { Injectable } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private firebaseService: FirebaseService,
    private router: Router) { }

  canActivate(): boolean {
    if (this.firebaseService.isLoggedIn()) {
      return true;
    }
    else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
