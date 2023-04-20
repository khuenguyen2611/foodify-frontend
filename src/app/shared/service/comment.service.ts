import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from 'src/environments/environment';
import { Comment} from '../tables/comment'

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = `${environment.foodOrderingBaseApiUrl}/products`;

  constructor(private httpClient: HttpClient) { }

  getProductRating(productId: number, thePage: number, thePageSize: number, sortBy: string, sortDir: string): Observable<GetResponseComment> {
    return this.httpClient.get<GetResponseComment>(this.baseUrl + `/${productId}/comments?pageNo=${thePage}&pageSize=${thePageSize}&sortBy=${sortBy}&sortDir=${sortDir}`)
  }
}

interface GetResponseComment {
  comments: Comment[];
  page: {
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}