import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TokenService } from './token.service';
import { ResultWithData } from '../../../../../datatypes/result';
import { Role } from '../../../../../datatypes/enums';
import { User } from '../../../../../datatypes/user';
import { Session } from '../../../../../datatypes/session';
import { CacheService } from './cache-service';

@Injectable()
export class UsersService {
  private usersURL = '/api/users';

  readonly MAX_AGE = 5000;

  constructor(
    private http: HttpClient,
    private cacheService: CacheService,
    private tokenService: TokenService
  ) { }

  getAll(): Observable<ResultWithData<any>> {
    const KEY = this.usersURL;
    return this.cacheService.get(KEY, this.http.get<ResultWithData<any>>(this.usersURL), this.MAX_AGE);
  }

  getAllByRole(role: Role): Observable<ResultWithData<any>> {
    return this.http.get<ResultWithData<any>>(this.usersURL, { params: { 'role': role.toString() } });
  }

  add(user: User): Observable<ResultWithData<any>> {
    return this.http.post<ResultWithData<any>>(this.usersURL, { user });
  }

  validatePasswordCurrentUser(password: string): Observable<ResultWithData<any>> {
    return this.http.post<ResultWithData<any>>(this.usersURL + '/validatePasswordCurrentUser', { password });
  }

  update(user: User): Observable<ResultWithData<any>> {
    return this.http.put<ResultWithData<any>>(this.usersURL, { user });
  }

  activeDeactivateUser(id: number, active: boolean): Observable<ResultWithData<any>> {
    return this.http.put<ResultWithData<any>>(this.usersURL + '/activeDeactivateUser', { id, active });
  }

  cleanNumberOfAttempts(id: number): Observable<ResultWithData<any>> {
    return this.http.put<ResultWithData<any>>(this.usersURL + '/cleanNumberOfAttempts', { id });
  }


  getCurrentUser(): Observable<ResultWithData<User>> {
    return this.http.get<ResultWithData<User>>(this.usersURL + '/current');
  }

  getRolCurrentUser(): Observable<ResultWithData<number>> {
    return this.http.get<ResultWithData<number>>(this.usersURL + '/getRolCurrentUser');
  }

  getCurrentUserName(): string {
    return this.tokenService.getUserNameToken();
  }

  getRols(): Observable<ResultWithData<any>> {
    return this.http.get<ResultWithData<any>>(this.usersURL + '/' + 'getRols');
  }

  getUsers(): Observable<ResultWithData<any>> {
    return this.http.get<ResultWithData<any>>(this.usersURL + '/' + 'getUsers');
  }

  getLastSessionActivity(): Observable<ResultWithData<Session[]>> {
    return this.http.get<ResultWithData<any>>(this.usersURL + '/' + 'getLastSessionActivity');
  }

  getSessionsByDate(userId: number, dateFrom: Date, dateTo: Date): Observable<ResultWithData<Session[]>> {
    const URL = this.usersURL + '/getSessionsByDate';
    const VALUES = { userId, dateFrom, dateTo };
    const KEY = URL + JSON.stringify(VALUES);
    return this.cacheService.get(KEY, this.http.post<ResultWithData<any[]>>(URL, VALUES), this.MAX_AGE);
  }

  getSessionsByCurrentUserByDate(dateFrom: Date, dateTo: Date): Observable<ResultWithData<Session[]>> {
    const URL = this.usersURL + '/getSessionsByCurrentUserByDate';
    const VALUES = { dateFrom, dateTo };
    const KEY = URL + JSON.stringify(VALUES);
    return this.cacheService.get(KEY, this.http.post<ResultWithData<any>>(URL, VALUES), this.MAX_AGE);
  }

  isAgent(username: string): Observable<ResultWithData<boolean>> {
    return this.http.get<ResultWithData<boolean>>(this.usersURL + '/' + `usernames/${username}/isAgent`);
  }

  isRol(rolId: number, rol: Role): boolean {
    return rolId === <number>rol;
  }

  isCurrentUserRole(rol: Role): boolean {
    return this.tokenService.getRoleUserNameToken() === <number>rol;
  }
}
