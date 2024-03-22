import { Component, ViewChild, OnInit } from '@angular/core';
import { ScrollbarDirective } from 'app/core/common/scrollbar/scrollbar.directive';
import { ImportDataService } from '../../../services/import-data.service';

@Component({

  templateUrl:'./supervisor-report.component.html',
  styleUrls: ['./supervisor-report.component.scss']
})
export class SupervisorReportComponent implements OnInit {
  supervisorView: boolean = true;

  @ViewChild('contentScroll', { read: ScrollbarDirective }) private contentScroll: ScrollbarDirective;
  constructor(
    private importService: ImportDataService) { }

  ngOnInit() {
  }

  public importData(): void {
    
  }

  public importDebt(): void {
    this.importService.importDebt().subscribe(
      response => {
        console.log(response);
      }
    );
  }
}
