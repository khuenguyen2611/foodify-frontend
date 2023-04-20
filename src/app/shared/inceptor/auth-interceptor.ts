import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { FirebaseService } from "../service/firebase.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private firebaseService: FirebaseService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('jwt-token');
        if (token != null && this.firebaseService.isTokenExpired()) {
            this.firebaseService.logout();
        }

        if (token != null) {
            const authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(authReq);
        } else {
            return next.handle(req);
        }
    }
}
