import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserDateReport } from '../../UserDateReport';
import { UsersService } from '../../../../services/users.service';
import { EventTypeService } from '../../../../services/event-type.service';
import { EventsService } from '../../../../services/events.service';
import { Observable } from 'rxjs';
import { ChartData } from 'chart.js';
import { DonutChartWidgetOptions } from '../../../../../core/widgets/donut-chart-widget/donut-chart-widget-options.interface';
import { DashboardService } from '../../../../../demo/dashboard/dashboard.service';
import { EventType } from '../../../../../../../../datatypes/eventType';

@Component({
  selector: 'fury-event-types-report',
  templateUrl: './event-types-report.component.html',
  styleUrls: ['./event-types-report.component.scss']
})
export class EventTypesReportComponent extends UserDateReport implements OnInit {

  loadingEvents: boolean;
  selectedUserId: number = 0;
  eventsCustomers: any[];
  eventTypes: EventType[];

  top5CategoriesData$: Observable<ChartData>;

  top5CategoriesOptions: DonutChartWidgetOptions = {
    title: 'Eventos con clientes',
    subTitle: 'Compare Sales by Category'
  };

  top5CategoriesDemoData = [
    {
      'label': 'Scanners',
      'value': 24
    },
    {
      'label': 'Smartphones',
      'value': 33
    },
    {
      'label': 'Printers',
      'value': 16
    },
    {
      'label': 'TVs',
      'value': 8
    },
    {
      'label': 'DVDs',
      'value': 19
    }
  ];

  cantEvents: number = 0;

  constructor(private eventService: EventsService,
    private eventTypeService: EventTypeService,
    private usersService: UsersService,
    private dashboardService: DashboardService
  ) {
    super(usersService);
  }

  ngOnInit() {
    //this.top5CategoriesData$ = this.dashboardService.getTop5Categories();
    //console.log(this.dashboardService.getTop5Categories());
    //this.top5CategoriesData$ = this.dashboardService.getTop5Categories();

    this.eventTypeService.getAll().subscribe(
      response => {
        this.eventTypes = response.data;
        this.searchEvents();

      }
    );
  }


  eventTypeById(id: number): EventType {
    return this.eventTypes.filter(e => e.id === id)[0];
  }


  searchEvents(): void {
    this.dateFrom.setHours(0, 0, 0, 0);
    this.dateTo.setHours(23, 59, 0, 0);

    this.loadingEvents = true;

    this.eventService.getEventCountTypeByUser(this.selectedUserId, this.dateFrom, this.dateTo).subscribe(
      response => {
        if (response.result > 0) {
          this.loadingEvents = false;
          this.eventsCustomers = response.data;

          this.cantEvents = 0;
          for (let i = 0; i < this.eventsCustomers.length; i++) {
            this.cantEvents += this.eventsCustomers[i].occurrences;
          }
          console.log(this.eventsCustomers);
        }
      }
    );

  }

}
