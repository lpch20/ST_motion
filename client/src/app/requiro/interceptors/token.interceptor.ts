// Copiado de https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8

import { Injectable, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(public tokenService: TokenService) { }

	/**
     * Intercept an outgoing `HttpRequest` and optionally transform it or the
     * response.
     *
     * Typically an interceptor will transform the outgoing request before returning
     * `next.handle(transformedReq)`. An interceptor may choose to transform the
     * response event stream as well, by applying additional Rx operators on the stream
     * returned by `next.handle()`.
     *
     * More rarely, an interceptor may choose to completely handle the request itself,
     * and compose a new event stream instead of invoking `next.handle()`. This is
     * acceptable behavior, but keep in mind further interceptors will be skipped entirely.
     *
     * It is also rare but valid for an interceptor to return multiple responses on the
     * event stream for a single request.
     */
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		var token = this.tokenService.generateHeaderToken();
		request = !!token ? request.clone({ headers: token }) : request;
		return next.handle(request);
	}
}

@NgModule({
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		},
		TokenService
	]
})
export class TokenInterceptorModule { }
