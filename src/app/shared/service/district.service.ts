import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { District } from '../tables/district';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/districts`

  constructor(private httpClient: HttpClient
  ) { }

  getAllDistricts(): Observable<District[]> {
    return this.httpClient.get<District[]>(this.baseUrl);
  }
}
