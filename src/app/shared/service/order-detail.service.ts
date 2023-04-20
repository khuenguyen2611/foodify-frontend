import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { OrderDetails } from '../tables/order-detail';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {

  private orderUrl = `${environment.foodOrderingBaseApiUrl}/orders`;

  constructor(private httpClient: HttpClient) { }

  getOrderDetail(orderId: number, thePage: number, thePageSize: number, sortBy: string, sortDir: string): Observable<GetResponseOrderDetail> {
    return this.httpClient.get<GetResponseOrderDetail>(this.orderUrl + `/${orderId}/details?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`)
  }

}

interface GetResponseOrderDetail {
  orders: OrderDetails[];
  page: {
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}
