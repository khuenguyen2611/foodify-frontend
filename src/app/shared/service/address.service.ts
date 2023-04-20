import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../tables/address';
import { AddressResponse } from '../tables/address-response';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private baseUrl = `${environment.foodOrderingBaseApiUrl}/addresses`;

  constructor(private httpClient: HttpClient) { }

  getAddressById(id: number) {
    return this.httpClient.get<Address>(this.baseUrl + `/${id}`);
  }

  deleteAddressById(id: number) {
    return this.httpClient.delete(this.baseUrl + `/${id}`);
  }

  getAllAddressPagination(thePage: number, thePageSize: number): Observable<GetResponseAddresses> {
    return this.httpClient.get<GetResponseAddresses>(this.baseUrl + `?pageNo=${thePage}&pageSize=${thePageSize}`);
  }

  findAddressesByName(name: string, thePage: number, thePageSize: number) {
    return this.httpClient.get<GetResponseAddresses>(this.baseUrl + `/search?address=${name}&pageNo=${thePage}&pageSize=${thePageSize}`);
  }
}

interface GetResponseAddresses {
  addresses: AddressResponse[],
  page: {
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
  };
}