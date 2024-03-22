import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AgreementData } from '../../../../../../datatypes/AgreementData';
import { DebtData } from '../../../../../../datatypes/DebtData';
import { PaymentData } from '../../../../../../datatypes/PaymentData';
import { ResultCode } from '../../../../../../datatypes/result';
import { CustomersService } from '../../services/customers.service';

@Component({
  selector: 'debt-data',
  templateUrl: './debt-data.component.html',
  styleUrls: ['./debt-data.component.css']
})
export class DebtDataComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  paymentsData: PaymentData[];
  private _customerId: number;

  showData: boolean;
  @Input() debts: DebtData[];
  payments: PaymentData[];
  agreements: AgreementData[];

  constructor(private customerService: CustomersService) {
    this.showData = true;
  }

  ngOnInit() {
  }

  get customerId(): number {
    return this._customerId;
  }
  @Input('customer-id')
  set customerId(customerId: number) {
    if (customerId && customerId != 0 && customerId != this._customerId) {
      this._customerId = customerId;
      // this.loadDebt();
      this.loadPayment();
      this.loadAgreement();
    }
  }

  // private loadDebt() {
  //   this.customerService.getCustomerDebtById(this.customerId).subscribe(response => {
  //     if (response.result == ResultCode.OK) {
  //       this.debts = response.data;
  //     }
  //     else {
  //       // TODO: complete error handling
  //       console.error(response);
  //     }
  //   }, err => {
  //     // TODO: complete error handling
  //     console.error(err);
  //   });
  // }

  private loadPayment() {
    this.customerService.getCustomerPaymentsById(this.customerId).subscribe(response => {
      if (response.result == ResultCode.OK) {
        this.payments = response.data;
        console.log(response);
      }
      else {
        // TODO: complete error handling
        console.error(response);
      }
    }, err => {
      // TODO: complete error handling
      console.error(err);
    });
  }

  private loadAgreement() {
    this.customerService.getCustomerAgreementById(this.customerId).subscribe(response => {
      if (response.result == ResultCode.OK) {
        this.agreements = response.data;
        console.log(response);
      }
      else {
        // TODO: complete error handling
        console.error(response);
      }
    }, err => {
      // TODO: complete error handling
      console.error(err);
    });
  }

  toggle(): void {
    this.showData = !this.showData;
  }





  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }



  // private static createPaymentData() {
  //   let paymentsData = new Array<PaymentData>();
  //   paymentsData.push({ signatureDate: "24/01", paymentDate: "30/05", totalFees: 30, currentFee: 4, amount: 1500, expiration: "24/05" });
  //   paymentsData.push({ signatureDate: "24/01", paymentDate: "30/05", totalFees: 30, currentFee: 3, amount: 1500, expiration: "24/05" });
  //   paymentsData.push({ signatureDate: "24/01", paymentDate: "30/05", totalFees: 30, currentFee: 2, amount: 1500, expiration: "24/05" });
  //   paymentsData.push({ signatureDate: "24/01", paymentDate: "30/05", totalFees: 30, currentFee: 2, amount: 1500, expiration: "24/05" });
  //   paymentsData.push({ signatureDate: "24/01", paymentDate: "30/05", totalFees: 30, currentFee: 2, amount: 1500, expiration: "24/05" });
  //   paymentsData.push({ signatureDate: "24/01", paymentDate: "30/05", totalFees: 30, currentFee: 2, amount: 1500, expiration: "24/05" });
  //   paymentsData.push({ signatureDate: "24/01", paymentDate: "30/05", totalFees: 30, currentFee: 2, amount: 1500, expiration: "24/05" });
  //   paymentsData.push({ signatureDate: "24/01", paymentDate: "30/05", totalFees: 30, currentFee: 2, amount: 1500, expiration: "24/05" });
  //   return paymentsData;
  // }
}

