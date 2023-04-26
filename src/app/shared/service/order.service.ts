import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs-compat";
import { environment } from "src/environments/environment";
import { Order } from "../tables/order-list";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private orderUrl = `${environment.foodOrderingBaseApiUrl}/orders`;
  private getOrderUrl = `${environment.foodOrderingBaseApiUrl}/users`;

  constructor(private httpClient: HttpClient) { }

  getOrdersPagination(
    thePage: number,
    thePageSize: number,
    sortBy: string,
    sortDir: string
  ): Observable<GetResponseOrders> {
    return this.httpClient.get<GetResponseOrders>(
      this.orderUrl + `?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  getOrdersByShopId(shopId: number, thePage: number, thePageSize: number, sortBy: string, sortDir: string) {
    return this.httpClient.get<GetResponseOrders>(environment.foodOrderingBaseApiUrl + `/shops/${shopId}/orders?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  ////

  getOrdersByUserId(userId: number, thePage: number, thePageSize: number, sortBy: string, sortDir: string) {
    return this.httpClient.get<GetResponseOrders>(this.getOrderUrl + `/${userId}/orders?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`)
  }

  getOrderById(userId: number, orderId: number): Observable<Order> {
    return this.httpClient.get<Order>(`${this.getOrderUrl}/${userId}/orders/${orderId}`);
  }

  updateOrderShipper(userId: number, orderId: number, shipperId: number) {
    return this.httpClient.put<Order>(`${this.getOrderUrl}/${userId}/orders/${orderId}/shipper?shipperId=${shipperId}`, "");
  }

  updateOrderStatus(userId: number, orderId: number, status: string): Observable<Order> {
    return this.httpClient.put<Order>(`${this.getOrderUrl}/${userId}/orders/${orderId}/status?status=${status}`, "");
  }

  deleteOrderById(userId: number, orderId: number): Observable<Order> {
    return this.httpClient.delete<Order>(`${this.getOrderUrl}/${userId}/orders/${orderId}`, {});
  }

  countOrderByDistrict(districtName: string) {
    return this.httpClient.get<number>(this.orderUrl + `/count?districtName=${districtName}`)
  }

  countShopOrderByDistrict(shopId: number, districtName: string) {
    return this.httpClient.get<number>(this.orderUrl + `/shop/${shopId}/count?districtName=${encodeURI(districtName)}`)
  }

  findOrdersByTrackingNumber(trackingNumber: string, thePage: number, thePageSize: number, sortBy: string, sortDir: string) {
    return this.httpClient.get<GetResponseOrders>(this.orderUrl + `/search?trackingNumber=${trackingNumber}&pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  findOrderByStatus(status: string, thePage: number, thePageSize: number, sortBy: string, sortDir: string) {
    return this.httpClient.get<GetResponseOrders>(this.orderUrl + `/get?status=${status}`);
  }
}

interface GetResponseOrders {
  orders: Order[];
  page: {
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}
