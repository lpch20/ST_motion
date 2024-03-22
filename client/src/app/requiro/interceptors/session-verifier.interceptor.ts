import { Injectable, NgModule, Injector } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticateService } from '../services/authenticate.service';
import { Router } from '@angular/router';

@Injectable()
export class SessionVerifierInterceptor implements HttpInterceptor {

    lastCheck: Date;
    router: Router;
    isChecking: boolean;

    constructor(public authService: AuthenticateService, inj: Injector) {
        this.isChecking = false;
        this.lastCheck = new Date();
        // force the first interception to be ejecuted
        this.lastCheck.setHours(this.lastCheck.getHours() - 1);
        // cyclic dependency
        this.router = inj.get(Router);
    }

    /**
     * Intercept an outgoing `HttpRequest` and optionally transform it or the response.
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
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isCheckNeeded() && this.isInterceptorEnabled(req) && !this.isChecking) {
            this.isChecking = true;
            this.authService.verifyToken().subscribe(
                response => {
                    this.isChecking = false
                    if (response.result === true) {
                        this.lastCheck = new Date();
                    } else {
                        this.router.navigate(['login']);
                    }
                },
                err => {
                    this.isChecking = false
                    this.router.navigate(['login']);
                    return Observable.throw(err);
                }
            );
        }
        // call original auth request.
        return next.handle(req);
    }

    isCheckNeeded(): any {
        const SECONDS_TO_WAIT_UNTIL_CHECK = 10;
        // the session is checked with 5 seconds delay to avoid overhead 
        let waitingFrameSeconds = Math.abs(<any>new Date() - <any>this.lastCheck) / 1000;
        return waitingFrameSeconds > SECONDS_TO_WAIT_UNTIL_CHECK;
    }

    isInterceptorEnabled(req: HttpRequest<any>): boolean {
        return req.url != '/api/authenticate/verifyToken'
    }
}

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SessionVerifierInterceptor,
            multi: true
        },
        // Router,
        AuthenticateService
    ]
})
export class SessionVerifierInterceptorModule { }