import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Location } from '../tables/location';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/google`;

  constructor(private httpClient: HttpClient) { }

  getLocation(address: string) {
    return this.httpClient.get<Location>(this.baseUrl + `?address=${address}`)
  }
}
