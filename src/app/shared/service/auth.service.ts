import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../tables/user';
import { StringBoolObject } from '../tables/string-bool-object';
import { Address } from '../tables/address';
import { Shop } from '../tables/shop';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/auth`;

  constructor(private httpClient: HttpClient) {

  }

  //Sign-up new User
  SignUpUser(user: User): Observable<User> {
    return this.httpClient.post<User>(this.baseUrl + '/register', user);
  }

  //Sign-up address for user
  SignUpUserAddress(userId: number, address: Address) {
    return this.httpClient.post<StringBoolObject>(this.baseUrl + `/${userId}/addresses`, address)
  }

  //Sign-up new shop
  SignUpShop(shop: Shop) {
    return this.httpClient.post(this.baseUrl + "/register-shop", shop)
  }

  checkEmailOrPhoneNumberExist(userDto: User) {
    return this.httpClient.post<StringBoolObject>(this.baseUrl + `/check`, userDto);
  }
}
