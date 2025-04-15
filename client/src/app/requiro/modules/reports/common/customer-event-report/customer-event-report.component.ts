import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import { Campaign } from "../../../../../../../../datatypes/Campaign";
import { CustomerCampaign } from "../../../../../../../../datatypes/CustomerCampaign";
import { EventType } from "../../../../../../../../datatypes/eventType";
import { ResultCode } from "../../../../../../../../datatypes/result";
import { CampaignService } from "../../../../services/campaign.service";
import { CustomersService } from "../../../../services/customers.service";
import { DepartamentsService } from "../../../../services/departaments.service";
import { EventTypeService } from "../../../../services/event-type.service";
import { EventsService } from "../../../../services/events.service";
import { UsersService } from "../../../../services/users.service";
import { UserDateReport } from "../../UserDateReport";

@Component({
  selector: "customer-event-report",
  templateUrl: "./customer-event-report.component.html",
})
export class CustomerEventReportComponent
  extends UserDateReport
  implements OnInit, AfterViewInit
{
  @Input() supervisorView: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  eventTypeSelected = 0;
  eventsCustomers: any[];
  eventTypes: EventType[] = new Array<EventType>();
  dataSource = new MatTableDataSource();
  departaments: { id: number; name: string }[];
  cities: { id: number; name: string; idDepartment }[];
  campaigns: Campaign[];
  campaignSelected: Campaign;
  customersCampaign: CustomerCampaign[];

  loadingEvents: boolean;
  selectedUserId = 0;
  displayedColumns = [
    "date",
    "eventType",
    "user",
    "ci",
    "customer",
    "departament",
    "city",
    "address",
    "phone",
    "message",
  ];
  // 'campaign',

  constructor(
    private eventService: EventsService,
    private eventTypeService: EventTypeService,
    private departamentService: DepartamentsService,
    private customersService: CustomersService,
    private campaignService: CampaignService,
    usersService: UsersService
  ) {
    super(usersService);
  }

  private getDepartments(): void {
    this.departamentService.getAll().subscribe(
      (d) => {
        this.departaments = d.data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  private getCities(): void {
    this.departamentService.getAllCities().subscribe(
      (c) => {
        this.cities = c.data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  private getCityById(id: number): {
    id: number;
    name: string;
    idDepartment: number;
  } {
    return this.cities ? this.cities.filter((c) => c.id === id)[0] : null;
  }

  private getDepartmentById(id: number): { id: number; name: string } {
    return this.departaments
      ? this.departaments.filter((c) => c.id === id)[0]
      : null;
  }

  public getCampaignByCustomerId(idCustomer: number): string {
    if (this.customersCampaign && this.campaigns) {
      const customerCampaign = this.customersCampaign.find(
        (cc) => cc.idCustomer === idCustomer
      );
      if (customerCampaign) {
        const campaign = this.campaigns.find(
          (c) => c.id === customerCampaign.idCampaign
        );
        if (campaign) {
          return campaign.name;
        }
      }
    }
    return "";
  }

  ngOnInit() {
    this.loadingEvents = true;
    this.getDepartments();
    this.getCities();

    this.eventTypeService.getAll().subscribe(
      (response) => {
        this.eventTypes = response.data;
        this.searchEvents();
      },
      (error) => {
        console.error(error);
      }
    );

    this.campaignService.getAll().subscribe(
      (responseCampaigns) => {
        if (responseCampaigns.result > 0) {
          this.campaigns = responseCampaigns.data;
        } else {
          console.error(responseCampaigns);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  searchEvents(): void {
    this.dateFrom.setHours(0, 0, 0, 0);
    this.dateTo.setHours(23, 59, 0, 0);

    // al buscar eventos, seleccionar la opcion Todos
    this.eventTypeSelected = 0;

    this.loadingEvents = true;

    if (this.supervisorView) {
      this.eventService
        .getEventByDate(this.selectedUserId, this.dateFrom, this.dateTo)
        .subscribe(
          (response) => {
            if (response.result === ResultCode.OK) {
              this.eventsCustomers = response.data;
              this.dataSource.data = response.data;

              if (response.data && response.data.length > 0) {
                const uniqueIdCustomers = Array.from(
                  new Set(response.data.map((c) => c.idCustomer))
                );
                this.customersService
                  .getCustomersCampaign(uniqueIdCustomers)
                  .subscribe(
                    (responseCustomersCampaign) => {
                      this.loadingEvents = false;
                      if (responseCustomersCampaign.result === ResultCode.OK) {
                        this.customersCampaign = responseCustomersCampaign.data;
                      } else {
                        console.error(responseCustomersCampaign);
                      }
                    },
                    (error) => {
                      this.loadingEvents = false;
                      console.error(error);
                    }
                  );
              } else {
                this.loadingEvents = false;
              }
            } else {
              this.loadingEvents = false;
              console.error(response);
            }
          },
          (error) => {
            this.loadingEvents = false;
            console.error(error);
          }
        );
    } else {
      this.eventService
        .getEventByCurrentUserByDate(this.dateFrom, this.dateTo)
        .subscribe(
          (response) => {
            if (response.result === ResultCode.OK) {
              this.eventsCustomers = response.data;
              this.dataSource.data = response.data;

              if (response.data && response.data.length > 0) {
                const uniqueIdCustomers = Array.from(
                  new Set(response.data.map((c) => c.idCustomer))
                );
                this.customersService
                  .getCustomersCampaign(uniqueIdCustomers)
                  .subscribe(
                    (responseCustomersCampaign) => {
                      this.loadingEvents = false;
                      if (responseCustomersCampaign.result === ResultCode.OK) {
                        this.customersCampaign = responseCustomersCampaign.data;
                      } else {
                        console.error(responseCustomersCampaign);
                      }
                    },
                    (error) => {
                      this.loadingEvents = false;
                      console.error(error);
                    }
                  );
              } else {
                this.loadingEvents = false;
              }
            } else {
              this.loadingEvents = false;
              console.error(response);
            }
          },
          (error) => {
            this.loadingEvents = false;
            console.error(error);
          }
        );
    }
  }

  changeEventType(id: number): void {
    if (id === 0) {
      this.dataSource.data = this.eventsCustomers;
    } else {
      this.dataSource.data = this.eventsCustomers.filter(
        (e) => e.eventType == id
      );
    }
  }

  isLoading(): boolean {
    return !!this.eventsCustomers && !!this.dataSource.data;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  exportCSV(): void {
    const options = {
      fieldSeparator: ";",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
    };

    const data: {
      agent;
      campaign;
      ci;
      idPay;
      result;
      tel;
      date;
      cliente;
      department;
      city;
      address;
      message;
      action;
      portfolio;
    }[] = new Array<{
      agent;
      campaign;
      ci;
      idPay;
      result;
      tel;
      date;
      cliente;
      department;
      city;
      address;
      message;
      action;
      portfolio;
    }>();

    const item = {
      agent: "Agente",
      campaign: "Campaña",
      date: "Fecha",
      result: "Resultado",
      ci: "CI",
      idPay: "idPago",
      cliente: "Cliente",
      tel: "Telefono",
      department: "Departamento",
      city: "Localidad",
      address: "Dirección",
      action: "Acción",
      message: "Observación",
      portfolio: "cartera",
    };
    data.push(item);

    for (let i = 0; i < this.eventsCustomers.length; i++) {
      const line = this.eventsCustomers[i];
      if (line) {
        const d = new Date(line.date);
        data.push({
          agent: this.findAgent(line.idUser),
          campaign: this.campaigns.filter(
            (c) =>
              c.id ===
              this.customersCampaign.filter(
                (cc) => cc.idCustomer === line.idCustomer
              )[0].idCampaign
          )[0].name,
          date: `${d.getDate()}/${
            d.getMonth() + 1
          }/${d.getFullYear()}  ${d.getHours()}:${d.getMinutes()}`,
          result: this.getEventTypeLabel(line.eventType),
          ci: line.ci,
          idPay: line.idPay,
          cliente: line.names + line.lastnames,
          tel: line.phone,
          department: this.getDepartmentById(line.idDepartment)
            ? this.getDepartmentById(line.idDepartment).name
            : "----",
          city: this.getCityById(line.idCity)
            ? this.getCityById(line.idCity).name
            : "----",
          address: line.address,
          action: line.action,
          message: line.message,
          portfolio: line.portfolio,
        });
      }
    }

    // TODO ?
    new Angular5Csv(data, "Eventos", options);
  }

  getEventTypeIcon(id: number): string {
    let icon = "";
    if (this.eventTypes !== null && this.eventTypes !== undefined) {
      const eventType = this.eventTypes.filter((e) => e.id == id)[0];
      if (eventType) {
        icon = eventType.icon;
      }
    }
    return icon;
  }

  getEventTypeLabel(id: number): string {
    let label = "";
    if (this.eventTypes !== null && this.eventTypes !== undefined) {
      const eventType = this.eventTypes.filter((e) => e.id == id)[0];
      if (eventType) {
        label = eventType.name;
      }
    }
    return label;
  }

  findAgent(id: number): any {
    const user = this._users.find((u) => u.id == id);
    return user ? user.user_name : "no definido";
  }
}
