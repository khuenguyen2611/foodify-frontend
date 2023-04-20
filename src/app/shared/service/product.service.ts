import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../tables/product';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private baseUrl = `${environment.foodOrderingBaseApiUrl}/products`;
    idString = '?'

    constructor(private httpClient: HttpClient) {
    }

    addProduct(product: Product): Observable<Product> {
        return this.httpClient.post<Product>(this.baseUrl, product);
    }

    getProductsPagination(thePage: number, thePageSize: number): Observable<GetResponseProducts> {
        return this.httpClient.get<GetResponseProducts>(this.baseUrl + `?pageNo=${thePage}&pageSize=${thePageSize}`);
    }

    getProductsPaginationAndSort(thePage: number, thePageSize: number, sortBy: string, sortDir: string): Observable<GetResponseProducts> {
        return this.httpClient.get<GetResponseProducts>(this.baseUrl + `?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
    }

    getProductsNoPagination() {
        return this.httpClient.get<Product[]>(environment.foodOrderingBaseApiUrl + `/v1/products`)
    }

    getProductById(productId: number): Observable<Product> {
        return this.httpClient.get<Product>(this.baseUrl + `/${productId}`);
    }

    getProductsByShopId(shopId: number, thePage: number, thePageSize: number): Observable<GetResponseProducts> {
        return this.httpClient.get<GetResponseProducts>(this.baseUrl + `/shops/${shopId}?pageNo=${thePage}&pageSize=${thePageSize}`)
    }

    getProductsByShopIdAndSort(shopId: number, thePage: number, thePageSize: number, sortBy: string, sortDir: string): Observable<GetResponseProducts> {
        return this.httpClient.get<GetResponseProducts>(this.baseUrl + `/shops/${shopId}?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
    }

    getProductsByShopIdNoPageable(shopId: number) {
        return this.httpClient.get<Product[]>(this.baseUrl + `/shops?id=${shopId}`);
    }

    getProductsByCategoryIds(categories: number[], thePage: number, thePageSize: number): Observable<GetResponseProducts> {
        this.idString = `/categories?`;
        categories.forEach(category => {
            this.idString = this.idString + `id=${category}&`
        });
        return this.httpClient.get<GetResponseProducts>(this.baseUrl + this.idString + `pageNo=${thePage}&pageSize=${thePageSize}`)
    }

    updateProductById(productId: number, product: Product) {
        return this.httpClient.put<Product>(this.baseUrl + `/${productId}`, product);
    }

    deleteProduct(productId: number) {
        return this.httpClient.delete(this.baseUrl + `/${productId}`);
    }

    searchProductsByName(name: string, thePage: number, thePageSize: number) {
        return this.httpClient.get<GetResponseProducts>(this.baseUrl + `/search?pageNo=${thePage}&pageSize=${thePageSize}&productName=${name}`)
    }

    searchShopProductsByName(shopId: number, name: string, thePage: number, thePageSize: number) {
        return this.httpClient.get<GetResponseProducts>(this.baseUrl + `/shop/${shopId}/search?pageNo=${thePage}&pageSize=${thePageSize}&productName=${name}`);
    }
}

interface GetResponseProducts {
    products: Product[];
    page: {
        pageNo: number,
        pageSize: number,
        totalElements: number,
        totalPages: number,
    };
}
