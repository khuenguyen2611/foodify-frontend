import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shipper } from '../tables/shipper';
import { User } from '../tables/user';

@Injectable({
  providedIn: 'root'
})
export class ShipperService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/shippers`;

  constructor(private httpClient: HttpClient) { }

  createShipper(shipper: Shipper): Observable<Shipper> {
    return this.httpClient.post<Shipper>(this.baseUrl, shipper)
  }

  getShipperPagination(thePage: number, thePageSize: number): Observable<GetResponseShippers> {
    return this.httpClient.get<GetResponseShippers>(this.baseUrl + `?pageNo=${thePage}&pageSize=${thePageSize}`)
  }

  getShipperByShopId(shopId: number, thePage: number, thePageSize: number, sortBy: string, sortDir: string) {
    return this.httpClient.get<GetResponseShippers>(this.baseUrl + `/shop/${shopId}?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`)
  }

  getShipperById(shipperId: number): Observable<Shipper> {
    return this.httpClient.get<Shipper>(this.baseUrl + `/${shipperId}`)
  }

  findShipperByName(name: string, thePage: number, thePageSize: number) {
    return this.httpClient.get<GetResponseShippers>(this.baseUrl + `/search?shipperName=${name}&pageNo=${thePage}&pageSize=${thePageSize}`);
  }

  findShopShipperByName(shopId: number, name: string, thePage: number, thePageSize: number) {
    return this.httpClient.get<GetResponseShippers>(this.baseUrl +
      `/shop/${shopId}/search?shipperName=${name}&pageNo=${thePage}&pageSize=${thePageSize}`);
  }

  findFreeShopShipper(shopId: number) {
    return this.httpClient.get<Shipper[]>(this.baseUrl + `/shop/${shopId}/search/free`);
  }

  updateShiperActive(shipperId: number, updateActive: Shipper, isActive: boolean): Observable<Shipper> {
    return this.httpClient.put<Shipper>(`${this.baseUrl}/${shipperId}/active?isActive=${isActive}`, updateActive)
  }

  updateShiperShipping(shipperId: number, updateShipping: Shipper, isShipping: boolean): Observable<Shipper> {
    return this.httpClient.put<Shipper>(`${this.baseUrl}/${shipperId}/shipping?isShipping=${isShipping}`, updateShipping)
  }

  deleteShipperById(shipperId: number): Observable<Shipper> {
    return this.httpClient.delete<Shipper>(`${this.baseUrl}/${shipperId}`, {})
  }
}

interface GetResponseShippers {
  shippers: Shipper[],
  page: {
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  }
}