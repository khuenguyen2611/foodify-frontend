import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class CsrfService {
    constructor(private http: HttpClient) {}

    // getToken(): Observable<string> {
    //     return this.http.get('/api/csrf-token', { responseType: 'text' });
    // }

    setToken(token: string): void {
        document.cookie = `XSRF-TOKEN=${token}`;
    }
}
