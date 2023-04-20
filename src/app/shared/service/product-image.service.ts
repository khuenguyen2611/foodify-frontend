import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { ProductImage } from '../tables/product-image';

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/products`;

  constructor(private httpClient: HttpClient) { }

  addProductImage(productImage: ProductImage, productId: number): Observable<ProductImage> {
    return this.httpClient.post<ProductImage>(this.baseUrl + `/${productId}/images`, productImage)
  }

  updateProductImage(productId: number, imageId: number, productImage: ProductImage) {
    return this.httpClient.put(this.baseUrl + `/${productId}/images/${imageId}`, productImage)
  }

  deleteProductImage(productId: number, imageId: number) {
    return this.httpClient.delete(this.baseUrl + `/${productId}/images/${imageId}`);
  }
}
