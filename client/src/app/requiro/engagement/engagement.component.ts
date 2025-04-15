import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import * as moment from "moment";
import { BranchOffice } from "../../../../../datatypes/BranchOffice";
import { EventType } from "../../../../../datatypes/eventType";
import { ResultCode } from "../../../../../datatypes/result";
import { UserDateReport } from "../modules/reports/UserDateReport";
import { BranchOfficeService } from "../services/branch-office.service";
import { EngagementService } from "../services/engagement.service";
import { EventTypeService } from "../services/event-type.service";
import { UsersService } from "../services/users.service";

@Component({
  selector: "engagement",
  templateUrl: "./engagement.component.html",
  styleUrls: ["./engagement.component.scss"],
})
export class EngagementComponent
  extends UserDateReport
  implements OnInit, AfterViewInit
{
  @Input() supervisorView: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource();
  displayedColumns = [
    "selected",
    "date",
    "result",
    "ci",
    "customer",
    "initialDelivery",
    "amountFees",
    "numberOfFees",
    "agreedDebt",
    "paymentPromiseDate",
    "idBranchOffice",
    "agent",
    "agentName",
    "countEngagement",
    "rate",
    "portfolio",
    "newEngagement",
  ];

  engagaments: any[];
  branchsOffice: BranchOffice[];
  eventTypes: EventType[];
  isLoadingEvents: boolean;
  showDetail = false;
  engagamentsByCustomer = new Array();
  customerEngagamentsDetail = new Array();
  selectedUserId: number;

  constructor(
    private engagementService: EngagementService,
    private branchOfficeService: BranchOfficeService,
    private eventTypeService: EventTypeService,
    private usersService: UsersService
  ) {
    super(usersService);
    this.isLoadingEvents = true;
  }

  ngOnInit() {
    this.usersService.getRolCurrentUser().subscribe(
      (resRolCurrentUser) => {
        if (
          resRolCurrentUser.result === ResultCode.OK &&
          resRolCurrentUser.data
        ) {
          const rolId = resRolCurrentUser.data[0].rol_id;

          this.supervisorView = rolId === 1 || rolId === 2;

          this.initDates();

          this.eventTypeService.getAll().subscribe(
            (response) => {
              if (response.result === ResultCode.OK) {
                this.eventTypes = response.data;
                this.searchEngagement();
              } else {
                console.error(response);
              }
            },
            (err) => {
              console.error(err);
            }
          );

          this.branchOfficeService.getAll().subscribe(
            (responseBranchOffice) => {
              if (responseBranchOffice.result === ResultCode.OK) {
                this.branchsOffice = responseBranchOffice.data;
                this.searchEngagement();
              } else {
                console.error(responseBranchOffice);
              }
            },
            (err) => {
              console.error(err);
            }
          );
        } else {
          console.error(resRolCurrentUser);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private initDates(): void {
    this.dateFrom = moment().toDate();
    this.dateTo = moment().toDate();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  isNewEngagement(e: any): boolean {
    console.log(e.length);
    if (e.length > 1) {
      const date0 = moment(e[0].paymentPromiseDate, "YYYY-MM-DD");
      const date1 = moment(e[1].paymentPromiseDate, "YYYY-MM-DD");
      return (
        e[0].numberOfFees !== e[1].numberOfFees ||
        e[0].idBranchOffice !== e[1].idBranchOffice ||
        date0.year() !== date1.year() ||
        date0.month() !== date1.month() ||
        date0.day() !== date1.day() ||
        e[0].agreedDebt !== e[1].agreedDebt
      );
    } else {
      return true;
    }
  }

  searchEngagement(): void {
    this.dateFrom.setHours(0, 0, 0, 0);
    this.dateTo.setHours(23, 59, 0, 0);

    this.isLoadingEvents = true;
    if (this.supervisorView) {
      this.engagementService
        .getEngagementsByDate(this.selectedUserId, this.dateFrom, this.dateTo)
        .subscribe((response) => {
          this.isLoadingEvents = false;
          this.bindEngagement(response);
        });
    } else {
      this.engagementService
        .getEngagementsByCurrentUserByDate(this.dateFrom, this.dateTo)
        .subscribe((response) => {
          this.isLoadingEvents = false;
          this.bindEngagement(response);
        });
    }
  }

  exportCSV(): void {
    const options = {
      fieldSeparator: ";",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
    };

    const data = new Array<{
      cliente: string;
      ci: string;
      date: string;
      numberOfFees: string;
      amountFees: string;
      agreedDebt: string;
      initialDelivery: string;
      branchOffice: string;
      agent: string;
      rate: string;
      portfolio: string;
      agentName: string;
    }>();
    data.push({
      ci: "CI",
      cliente: "Cliente",
      date: "Fecha de promesa de pago",
      numberOfFees: "Numero de cuotas",
      amountFees: "Importe de la cuota",
      agreedDebt: "Deuda Acordada",
      initialDelivery: "Entrega Inicial",
      branchOffice: "Oficina",
      agent: "Agente",
      rate: "Tasa",
      portfolio: "Cartera",
      agentName: "Nombre de agente",
    });

    const dataToExport = this.engagamentsByCustomer.filter(
      (e) => e.active === true
    );
    console.log(dataToExport);
    for (let i = 0; i < dataToExport.length; i++) {
      const line = dataToExport[i].engagements[0];
      const d = new Date(line.paymentPromiseDate);
      data.push({
        ci: line.ci,
        cliente: line.names + line.lastnames,
        date: d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
        numberOfFees: line.numberOfFees,
        amountFees: line.amountFees,
        agreedDebt: line.agreedDebt,
        initialDelivery: line.initialDelivery,
        branchOffice: this.getBranchOfficeById(line.idBranchOffice),
        agentName: this.getUsernameByUserId(line.idUser),
        rate: line.rate ? line.rate : "",
        portfolio: line.portfolio ? line.portfolio : "",
        agent: this.getNameByUserId(line.idUser),
      });
    }
    //
    new Angular5Csv(data, "Compromisos", options);
  }

  private bindEngagement(response) {
    if (response.result > 0) {
      this.engagaments = response.data;
      const engagamentsByCustomerMap: Map<number, any> = new Map<number, any>();
      for (let i = 0; i < this.engagaments.length; i++) {
        const engagament = engagamentsByCustomerMap.get(
          this.engagaments[i].idCustomer
        );
        if (engagament) {
          engagament.engagements.push(this.engagaments[i]);
        } else {
          const containerEngagement = {
            active: true,
            engagements: new Array(),
          };
          const customerEngagaments = new Array();
          containerEngagement.engagements.push(this.engagaments[i]);
          engagamentsByCustomerMap.set(
            this.engagaments[i].idCustomer,
            containerEngagement
          );
        }
      }

      this.engagamentsByCustomer = Array.from(
        engagamentsByCustomerMap.values()
      );

      for (let i = 0; i < this.engagamentsByCustomer.length; i++) {
        this.engagamentsByCustomer[i].active = this.isNewEngagement(
          this.engagamentsByCustomer[i].engagements
        );
      }

      this.dataSource.data = this.engagamentsByCustomer;
      console.log(this.engagamentsByCustomer);
    }
  }

  hiddeDetail(): void {
    this.customerEngagamentsDetail = new Array();
    this.showDetail = false;
  }

  setCustomerEngagementDetail(detail: Array<any>): void {
    this.customerEngagamentsDetail = detail;
    this.showDetail = true;
  }

  getBranchOfficeById(id: number): string {
    let branchOffice = "";
    if (this.branchsOffice !== null && this.branchsOffice !== undefined) {
      const bo = this.branchsOffice.filter((e) => e.id === id)[0];
      if (bo) {
        branchOffice = bo.name;
      }
    }
    return branchOffice;
  }

  getEventTypeIcon(id: number): string {
    let icon = "";
    if (this.eventTypes !== null && this.eventTypes !== undefined) {
      const eventType = this.eventTypes.filter((e) => e.id === id)[0];
      if (eventType) {
        icon = eventType.icon;
      }
    }
    return icon;
  }

  getUser(id: number): string {
    const user = this._users.find((u) => u.id === id);
    return user ? `${user.firstname} ${user.lastname}` : "sin usuario";
  }
}
