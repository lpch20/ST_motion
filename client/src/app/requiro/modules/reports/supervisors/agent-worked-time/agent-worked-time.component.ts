// import { Component } from '@angular/core';
// import * as moment from 'moment';

// // lo dejo de ejemplo: pero este lo colapso con el otro
// // @Component({
//   // tslint:disable-next-line:component-selector
// //   selector: 'agent-worked-time',
// //   templateUrl: './agent-worked-time.component.html',
// //   styleUrls: ['./agent-worked-time.component.scss']
// // })
// export class AgentWorkedTimeComponent {

//   breaks: Break[];
//   sessions: any[];
//   totalTimeBreak: any;
//   totalTimeSession: any;

//   dateFromBreaks: Date;
//   dateFromSession: Date;
//   dateToBreaks: Date;
//   dateToSession: Date;

//   constructor(
//     private breakService: BreakService,
//     private usersService: UsersService
//   ) { }

//   public workTime(): string {
//     let totalSecondsBreaks: number = 0;
//     for (let i = 0; i + 1 < this.breaks.length; i = i + 2) {
//       const date1 = moment(this.breaks[i].date, 'YYYY-MM-DDTHH:mm:ss.SSS');
//       const date2 = moment(this.breaks[i + 1].date, 'YYYY-MM-DDTHH:mm:ss.SSS');
//       totalSecondsBreaks += date2.diff(date1, 'seconds');
//     }

//     let totalSecondsSessions: number = 0;
//     for (let i = 0; i + 1 < this.sessions.length; i = i + 2) {
//       const date1 = moment(this.sessions[i].date, 'YYYY-MM-DDTHH:mm:ss.SSS');
//       const date2 = moment(this.sessions[i + 1].date, 'YYYY-MM-DDTHH:mm:ss.SSS');
//       totalSecondsSessions += date2.diff(date1, 'seconds');
//     }

//     const duration = moment.duration(totalSecondsSessions - totalSecondsBreaks, 'seconds');
//     return ('0' + duration.hours()).slice(-2) + ':' + ('0' + duration.minutes()).slice(-2) + ':' + ('0' + duration.seconds()).slice(-2);
//   }

//   private totalDurationBreaks(): void {
//     let totalSeconds: number = 0;
//     for (let i = 0; i + 1 < this.breaks.length; i = i + 2) {
//       const date1 = moment(this.breaks[i].date, 'YYYY-MM-DDTHH:mm:ss.SSS');
//       const date2 = moment(this.breaks[i + 1].date, 'YYYY-MM-DDTHH:mm:ss.SSS');
//       totalSeconds += date2.diff(date1, 'seconds');
//     }
//     const duration = moment.duration(totalSeconds, 'seconds');


//     this.totalTimeBreak = ('0' + duration.hours()).slice(-2) + ':' +
//     ('0' + duration.minutes()).slice(-2) + ':' +
//     ('0' + duration.seconds()).slice(-2);
//   }

//   private totalDurationSessions(): void {
//     let totalSeconds: number = 0;
//     for (let i = 0; i + 1 < this.sessions.length; i = i + 2) {
//       const date1 = moment(this.sessions[i].date, 'YYYY-MM-DDTHH:mm:ss.SSS');
//       const date2 = moment(this.sessions[i + 1].date, 'YYYY-MM-DDTHH:mm:ss.SSS');
//       console.log(i, i + 1);
//       totalSeconds += date2.diff(date1, 'seconds');
//     }

//     const duration = moment.duration(totalSeconds, 'seconds');
//     this.totalTimeSession =  ('0' + duration.hours()).slice(-2) + ':' +
//      ('0' + duration.minutes()).slice(-2) + ':' +
//      ('0' + duration.seconds()).slice(-2);
//   }

//   searchBreaks(): void {
//     this.dateFromBreaks.setHours(0);
//     this.dateFromBreaks.setMinutes(0);
//     this.dateToBreaks.setHours(23);
//     this.dateToBreaks.setMinutes(59);
//     this.breakService.getBreakByCurrentUserByDate(this.dateFromBreaks, this.dateToBreaks).subscribe(
//       response => {
//         if (response.result > 0) {
//           this.breaks = response.data;
//           this.totalDurationBreaks();
//         }
//       }
//     );
//   } 

//   searchSessions(): void {
//     this.dateFromSession.setHours(0);
//     this.dateFromSession.setMinutes(0);
//     this.dateToSession.setHours(23);
//     this.dateToSession.setMinutes(59);
//     this.usersService.getSessionsByCurrentUserByDate(this.dateFromSession, this.dateToSession).subscribe(
//       responseSession => {
//         if (responseSession.result > 0) {
//           this.sessions = responseSession.data;
//           this.totalDurationSessions();
//         }
//       }
//     );
//   }
// }
