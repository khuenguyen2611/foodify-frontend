import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { Address } from '../tables/address';
import { StringBoolObject } from '../tables/string-bool-object';
import { User, UserInfo } from '../tables/user';
import { userInfo } from 'os';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/users`;

  constructor(private httpClient: HttpClient) { }

  //Create new User
  createNewUser(user: User): Observable<User> {
    return this.httpClient.post<User>(this.baseUrl, user);
  }

  //Get User By Id
  getUserById(userId): Observable<User> {
    return this.httpClient.get<User>(this.baseUrl + `/${userId}`)
  }

  //Get User By Email Or Phone Number
  getUserByEmailOrPhoneNumber(emailOrPhoneNumber: string) {
    return this.httpClient.get<User>(this.baseUrl + `/v1/email?emailOrPhoneNumber=${emailOrPhoneNumber}`);
  }

  //Update user
  updateUser(userId: number, userUpdate: User): Observable<User> {
    return this.httpClient.put<User>(this.baseUrl + `/${userId}`, userUpdate);
  }

  //Create address for user
  createAddressForUser(userId: number, address: Address) {
    return this.httpClient.post<StringBoolObject>(this.baseUrl + `/${userId}/addresses`, address)
  }

  //Update Address for User
  updateUserAddress(userId: number, addressId: number, updateAddress: Address) {
    return this.httpClient.put<Address>(this.baseUrl + `/${userId}/addresses/${addressId}`, updateAddress)
  }

  //Update User Default Address
  updateUserDefaultAddress(userId: number, defaultAddressId: number) {
    return this.httpClient.put(this.baseUrl + `/${userId}/addresses/default?addressId=${defaultAddressId}`, '');
  }

  //Delete User By Id
  deleteUserById(userId: number) {
    return this.httpClient.delete(this.baseUrl + `/${userId}`)
  }

  //Delete User Address
  deleteUserAddress(userId: number, addressId: number) {
    return this.httpClient.delete(this.baseUrl + `/${userId}/addresses/${addressId}`)
  }

  //Get All Users
  getAllUsers(thePage: number, thePageSize: number, sortBy: string, sortDir: string) {
    return this.httpClient.get(this.baseUrl + `?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  //Find All Users By Role
  getAllUsersByRole(roleName: string, thePage: number, thePageSize: number, sortBy: string, sortDir: string) {
    return this.httpClient.get(this.baseUrl + `/roles/${roleName}?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  //Find All User By Role And Email/PhoneNumber
  getAllUsersByRoleAndEmailOrPhoneNumber(emailOrPhoneNumber: string, roleName: string, thePage: number, thePageSize: number, sortBy: string, sortDir: string) {
    return this.httpClient.get(this.baseUrl + `/roles/${roleName}/email?emailOrPhoneNumber=${emailOrPhoneNumber}&pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  //Find All User By Email/PhoneNumber
  getAllUsersByEmailOrPhoneNumber(emailOrPhoneNumber: string, thePage: number, thePageSize: number, sortBy: string, sortDir: string) {
    return this.httpClient.get(this.baseUrl + `/email/search?emailOrPhoneNumber=${emailOrPhoneNumber}&pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  //Count new User
  countNewUser(day: number) {
    return this.httpClient.get<number>(this.baseUrl + `/count?day=${day}`);
  }

  //Get User By Token
  getUserByToken(token: string) {
    return this.httpClient.get<UserInfo>(this.baseUrl + `/info?token=${token}`);
  }

  //User Info
  getUserInfo(): UserInfo {
    const token = localStorage.getItem("jwt-token");
    this.httpClient.get<UserInfo>(this.baseUrl + `/info?token=${token}`).subscribe((userInfo) => {
      console.log(userInfo)
      return userInfo;
    })
    return null;
  }
}