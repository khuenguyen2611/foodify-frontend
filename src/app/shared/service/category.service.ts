import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { Category } from '../tables/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/categories`;

  constructor(private httpClient: HttpClient) { }

  getCategories(): Observable<Category[]> {
    const categories = this.httpClient.get<Category[]>(this.baseUrl);
    return categories;
  }

  editCategoryById(categoryId: number, category: Category): Observable<Category> {
    return this.httpClient.put<Category>(this.baseUrl + `/${categoryId}`, category)
  }

  deleteCategoryById(categoryId: number) {
    return this.httpClient.delete(this.baseUrl + `/${categoryId}`);
  }
}
