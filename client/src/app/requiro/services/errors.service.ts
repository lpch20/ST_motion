import { Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';
import * as StackTraceParser from 'error-stack-parser';
import { ResultWithData } from '../../../../../datatypes/result';
import { IClientError } from '../../../../../datatypes/clientError';
import { TokenService } from './token.service';

@Injectable()
export class ErrorsService {
    readonly errorLogURL = '/api/clientErrorLog';
    private _http: HttpClient;
    private _token: TokenService;

    constructor(private injector: Injector) { }

    private get http(): HttpClient {
        if (!this._http && this.injector) {
            this._http = this.injector.get(HttpClient);
        }
        return this._http;
    }
    private get token(): TokenService {
        if (!this._token && this.injector) {
            this._token = this.injector.get(TokenService);
        }
        return this._token;
    }

    log(error) {
        // Log the error to the console
        console.error(error);

        // Send error to server
        const errorToSend = this.addContextInfo(error);
        return this.http.put<ResultWithData<any>>(this.errorLogURL, { error: errorToSend });
    }

    addContextInfo(error): IClientError {
        // All the context details that you want (usually coming from other services; Constants, UserService...)
        const name = error.name || null;
        const user = this.token.getUserNameToken();
        const location: LocationStrategy = this.injector.get(LocationStrategy);
        const url = location instanceof PathLocationStrategy || location instanceof HashLocationStrategy ? location.path() : '';
        const status = error.status || null;
        const message = error.message || error.toString();
        const stack = error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);
        const errorToSend: IClientError = { name, user, url, status, message, stack };
        return errorToSend;
    }
}
