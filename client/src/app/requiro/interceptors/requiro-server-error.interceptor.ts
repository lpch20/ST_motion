// server-errors.interceptor.ts
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';

@Injectable()
export class RequiroServerErrorInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // If the call fails and it is GET -> retry until 5 times before throwing an error
        if (request.method === 'GET') {
            return next.handle(request).retry(3);
        } else {
            return next.handle(request);
        }
    }
}
