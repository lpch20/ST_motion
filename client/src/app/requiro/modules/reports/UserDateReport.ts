import { FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IBreak } from '../../../../../../datatypes/Break';
import { ResultCode } from '../../../../../../datatypes/result';
import { Session } from '../../../../../../datatypes/session';
import { User } from '../../../../../../datatypes/user';
import { UsersService } from '../../services/users.service';

export class UserDateReport {
  dateFromCtrl: FormControl;
  dateToCtrl: FormControl;
  dateFrom: Date;
  dateTo: Date;
  _users: User[];
  isLoadingEvents: boolean;

  constructor(private _usersService: UsersService) {
    this.dateFromCtrl = new FormControl('', { validators: Validators.required });
    this.dateToCtrl = new FormControl('', { validators: Validators.required });

    this.dateFrom = moment().subtract(3, 'days').toDate();
    this.dateTo = moment().toDate();

    setTimeout(() => {
      this._usersService.getAll().subscribe(
        response => {
          if (response.result === ResultCode.OK) {
            this._users = response.data;
          } else {
            console.error(response);
          }
        },
        error => {
          console.error(error);
        }

      );
    }, 500);
  }

  static calculateTimes(sessions: Session[], breaks: IBreak[]): any {
    const breaksByUser = _.chain(breaks)
      .groupBy(s => s.idUser)
      .map((breakByUser, userId) => {
        return {
          userId: parseInt(userId, 10),
          total: UserDateReport.calculateTimesByUser(breakByUser, this.isBreakStart)
        };
      })
      .value();
    const sessionsByUser = _.chain(sessions)
      .groupBy(s => s.userId)
      .map((sessionByUser, userId) => {
        return {
          userId: parseInt(userId, 10),
          total: UserDateReport.calculateTimesByUser(sessionByUser, UserDateReport.isSessionStart)
        };
      })
      .value();

    return _.chain(sessions.map(s => s.userId).concat(breaks.map(b => b.idUser)))
      .uniq()
      .map(userId => {
        const breakTime: any = breaksByUser.find((b: any) => b.userId === userId);
        const loginTime: any = sessionsByUser.find((b: any) => b.userId === userId);

        const totalBreakTime = breakTime && breakTime.total > 0 ? breakTime.total : 0;
        const totalLoginTime = loginTime && loginTime.total > 0 ? loginTime.total : 0;

        return {
          userId: userId,
          breakTime: totalBreakTime,
          loginTime: totalLoginTime,
          totalWorkTime: totalLoginTime - totalBreakTime > 0 ? totalLoginTime - totalBreakTime : 0
        };
      })
      .value();
  }

  static calculateTimesByUser(sessionByUser: (Session | IBreak)[], isStart: (n: Session | IBreak) => boolean): number {
    const time = _.chain(sessionByUser)
      .groupBy(s => {
        const g = `${new Date(s.date).getFullYear()}-${new Date(s.date).getMonth()}-${new Date(s.date).getDate()}`;
        return g;
      })
      .map(ss => this.calculateTimesByUserByDay(ss, isStart))
      .sum()
      .value();
    return time;
  }

  static calculateTimesByUserByDay(sessionByUser: (Session | IBreak)[], isStart: (n: Session | IBreak) => boolean): number {
    let time = 0;
    if (sessionByUser && sessionByUser.length > 1) {
      const sessionByUserSorted = _.sortBy(sessionByUser, s => s.date);

      let beginDate = sessionByUserSorted[0].date;
      let keepCalculating = true;
      let iterations = 0;
      while (keepCalculating && iterations <= sessionByUserSorted.length) {
        const login = sessionByUserSorted.find(s => s.date >= beginDate && isStart(s));
        if (login) {
          beginDate = login.date;
          const logout = sessionByUserSorted.find(s => s.date >= login.date && !isStart(s));
          if (logout || moment(login.date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isSame(moment(), 'day')) {
            beginDate = logout ? logout.date : new Date();

            const date1 = moment(login.date, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
            const date2 = logout ? moment(logout.date, 'YYYY-MM-DDTHH:mm:ss.SSSZ') : moment();

            time += date2.diff(date1, 'seconds');
          } else {
            keepCalculating = false;
          }
        } else {
          keepCalculating = false;
        }
        iterations++;
      }
    }
    return time;
  }

  static isSessionStart(s: Session | IBreak): boolean {
    return (<any>(<Session>s).login) === 1;
  }

  static isBreakStart(s: Session | IBreak): boolean {
    return (<any>(<IBreak>s).init) === 1;
  }

  formatDuration(seconds: number) {
    const duration = moment.duration(seconds, 'seconds');
    return ('0' + duration.hours()).slice(-2) + ':' +
      ('0' + duration.minutes()).slice(-2) + ':' +
      ('0' + duration.seconds()).slice(-2);
  }

  protected totalDuration(data: { date: Date }[]): string {
    let totalSeconds = 0;
    for (let i = 0; i + 1 < data.length; i = i + 2) {
      const date1 = moment(data[i].date, 'YYYY-MM-DDTHH:mm:ss.SSS');
      const date2 = moment(data[i + 1].date, 'YYYY-MM-DDTHH:mm:ss.SSS');
      totalSeconds += date2.diff(date1, 'seconds');
    }
    const duration = moment.duration(totalSeconds, 'seconds');
    return ('0' + duration.hours()).slice(-2) + ':' + ('0' + duration.minutes()).slice(-2) + ':' + ('0' + duration.seconds()).slice(-2);
  }

  private getUserById(idUser: number): User {
    if (this._users && typeof this._users.filter === 'function') {
      return this._users.filter(u => u.id === idUser)[0];
    } else {
      return null;
    }
  }

  public getUsernameByUserId(idUser: number): string {
    const user = this.getUserById(idUser);
    return user ? user.user_name : 'sin usuario';
  }

  public getNameByUserId(idUser: number): string {
    const user = this.getUserById(idUser);
    return user ? `${user.lastname}, ${user.firstname}` : 'sin usuario';
  }
}
