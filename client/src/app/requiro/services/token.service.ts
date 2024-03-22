import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class TokenService {

	constructor() { }

	public setToken(tokenId: string, user: string, accountId: string, rolId: number, agent?: string) {
		localStorage.setItem('token', tokenId);
		localStorage.setItem('user', user);
		localStorage.setItem('accountId', accountId);

		if (rolId) {
			localStorage.setItem('rolId', rolId.toString());
		}
		if (agent) {
			localStorage.setItem('agent', agent.toString());
		}
	}

	public removeToken() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('accountId');
		localStorage.removeItem('rolId');
		localStorage.removeItem('agent');
	}

	public generateHeaderToken(): HttpHeaders {
		const token = localStorage.getItem('token');
		const userSaved = localStorage.getItem('user');
		const accountId = parseInt(localStorage.getItem('accountId'));

		return this.generateHeaderTokenFromValues(token, userSaved, accountId);
	}

	public getUserNameToken() {
		return localStorage.getItem('user');
	}

	public getRoleUserNameToken(): number {
		return parseInt(localStorage.getItem('rolId'));
	}

	public getAgentToken(): string {
		return localStorage.getItem('agent');
	}

	public updateUserNameToken(usernameToken: string): void {
		localStorage.setItem('user', usernameToken);
	}

	private generateHeaderTokenFromValues(token: string, userSaved: string, accountId: number): HttpHeaders {
		let headers = null;

		if (!!token && !!userSaved && !!accountId) {
			headers = new HttpHeaders({
				tokenId: token,
				user: userSaved,
				accountId: accountId.toString()
			});
		}
		return headers;
	}
}
