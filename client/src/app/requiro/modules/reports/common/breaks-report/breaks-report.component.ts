import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { UserDateReport } from '../../UserDateReport';
import { Break } from '../../../../../../../../datatypes/Break';
import { BreakType } from '../../../../../../../../datatypes/BreakType';
import { BreakService } from '../../../../services/break.service';
import { UsersService } from '../../../../services/users.service';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { ResultCode } from '../../../../../../../../datatypes/result';

@Component({
  selector: 'breaks-report',
  templateUrl: './breaks-report.component.html'
})
export class BreaksReportComponent extends UserDateReport implements OnInit, AfterViewInit {

  @Input() supervisorView: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  breaks: Break[];
  totalTimeBreak = '';
  totalTimeBreakByType: BreakByType[] = [];

  selectedUserId = 0;
  breakTypes: BreakType[];
  dataSource = new MatTableDataSource();
  displayedColumns = ['date', 'idUser', 'idTypeBreak', 'init'];

  constructor(private breakService: BreakService,
    usersService: UsersService) {
    super(usersService);
  }

  ngOnInit() {
    this.displayedColumns = this.supervisorView ? ['date', 'idUser', 'idTypeBreak', 'init'] : ['date', 'idTypeBreak', 'init'];
    this.breakService.getBreakTypes().subscribe(
      response => {
        if (response.result > 0) {
          this.breakTypes = response.data;
          this.searchBreaks();
        }
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  exportCSV(): void {
    const options = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true
    };

    const data: { date, agentName, agent, motivo, type }[] = [];

    data.push({ date: 'Fecha', agentName: 'Nombre del agente', agent: 'Agente', motivo: 'Motivo', type: 'Tipo' });
    for (let i = 0; i < this.breaks.length; i++) {
      const line = this.breaks[i];
      const d = new Date(line.date);
      data.push({
        date: d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes(),
        agentName: this.getNameByUserId(line.idUser),
        agent: this.getUsernameByUserId(line.idUser),
        motivo: this.getBreakTypeNameById(line.idTypeBreak),
        type: line.init ? 'Inicio' : 'Fin'
      });
    }

    data.push({ date: '', agent: '', agentName: '', motivo: '', type: '' });
    for (let i = 0; i < this.totalTimeBreakByType.length; i++) {
      data.push({ date: this.totalTimeBreakByType[i].type, agentName: '', agent: '', motivo: '', type: '' });
      data.push({ date: this.totalTimeBreakByType[i].time, agentName: '', agent: '', motivo: '', type: '' });
    }
    data.push({ date: '', agentName: '', agent: '', motivo: '', type: '' });
    data.push({ date: 'Total', agentName: '', agent: '', motivo: '', type: '' });
    data.push({ date: this.totalTimeBreak, agentName: '', agent: '', motivo: '', type: '' });

    // tslint:disable-next-line:no-unused-expression
    new Angular5Csv(data, 'pausas', options);
  }

  getBreakTypeNameById(idBreakType: number): string {
    if (this.breakTypes) {
      const breakType: BreakType = this.breakTypes.filter(u => u.id === idBreakType)[0];
      return breakType.label;
    } else {
      return '';
    }
  }

  searchBreaks(): void {
    this.dateFrom.setHours(0, 0, 0, 0);
    this.dateTo.setHours(23, 59, 0, 0);

    if (this.selectedUserId !== 0) {
      this.displayedColumns = ['date', 'idTypeBreak', 'init'];
    }

    if (this.supervisorView) {
      this.breakService.getBreakByDate(this.selectedUserId, this.dateFrom, this.dateTo).subscribe(
        response => {
          if (response.result === ResultCode.OK) {
            this.breaks = response.data;
            this.dataSource.data = response.data;
            this.totalTimeBreakByType = response.data && response.data.length > 0 ?
              this.calculateTotalTimeBreakByType(response.data) :
              [];
            this.totalTimeBreak = response.data && response.data.length > 0 ?
              this.totalDuration(this.breaks) :
              '';
          } else {
            console.error(response);
          }
        },
        error => {
          console.error(error);
        }
      );
    } else {
      this.breakService.getBreakByCurrentUserByDate(this.dateFrom, this.dateTo).subscribe(
        response => {
          if (response.result === ResultCode.OK) {
            this.breaks = response.data;
            this.dataSource.data = response.data;
            this.totalTimeBreakByType = this.calculateTotalTimeBreakByType(response.data);
            this.totalTimeBreak = this.totalDuration(this.breaks);
          } else {
            console.error(response);
          }
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  private calculateTotalTimeBreakByType(data): BreakByType[] {
    const totalTimeBreakByType = [];
    for (let i = 0; i < this.breakTypes.length; i++) {
      const breaksByType: Array<any> = data.filter(b => b.idTypeBreak === this.breakTypes[i].id);
      if (breaksByType.length > 0) {
        totalTimeBreakByType.push({ type: this.breakTypes[i].label, time: this.totalDuration(breaksByType) });
      }
    }
    return totalTimeBreakByType;
  }
}

interface BreakByType {
  type: string;
  time: string;
}
