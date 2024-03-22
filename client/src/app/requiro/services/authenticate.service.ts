import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TokenService } from './token.service';

@Injectable()
export class AuthenticateService {
	AUTHENTICATE_URL: string = '/api/authenticate';

	constructor(private http: HttpClient, private tokenService: TokenService) { }

	login(user: String, pass: String, agent: string): Observable<any> {
		return this.http.post(this.AUTHENTICATE_URL + '/login', { user, pass, agent });
	}

	changePasswordAndLogin(user: String, pass: String, newPass: string): Observable<any> {
		let agent = this.tokenService.getAgentToken();
		return this.http.post(this.AUTHENTICATE_URL + '/changePasswordAndLogin', { user, pass, newPass, agent });
	}

	verifyToken(): Observable<any> {
		return this.http.get(this.AUTHENTICATE_URL + '/verifyToken');
	}

	closeSession(): Observable<any> {
		let agent = this.tokenService.getAgentToken();
		return this.http.get(this.AUTHENTICATE_URL + '/closeSession/' + agent);
	}

	cleanSessions(): Observable<any> {
		return this.http.get(this.AUTHENTICATE_URL + '/cleanSessions/');
	}


	isAuthenticated(): boolean {
		return !!this.tokenService.getUserNameToken();
	}
}
