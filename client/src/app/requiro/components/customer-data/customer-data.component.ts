import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Customer } from '../../../../../../datatypes/Customer';
import { Observable } from 'rxjs/Observable';
import { CustomersService } from '../../services/customers.service';
import { CallService } from '../../services/call.service';
import { DepartamentsService } from '../../services/departaments.service';
import { map, startWith } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { FormControl } from '@angular/forms';
import { FieldValidator } from '../../../../../../server/src/DLabLib/FieldValidator';
import { ResultCode } from '../../../../../../datatypes/result';
import { MainCallDataServiceService } from '../../services/main-call-data-service.service';
import * as _ from 'lodash';
import { CareerService } from '../../services/career.service';

@Component({
  selector: 'customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.css']
})
export class CustomerDataComponent implements OnInit, OnChanges {

  @Input() currentCustomer: Customer;
  @Output() makeACall: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeIndexPhone = new EventEmitter<number>();

  departaments: { id: number, name: string }[];
  departmentSelected: { id: number, name: string };

  cities: { id: number, name: string, idDepartment: number }[];
  citySelected: { id: number, name: string, idDepartment: number };

  careers: { id: number, name: string }[];
  careerSelected: any;

  public profesion: any;

  stateCtrl: FormControl;
  cityCtrl: FormControl;
  careerCtrl: FormControl;

  filteredStates: Observable<{ id: number, name: string }[]>;
  filteredCities: Observable<{ id: number, name: string, idDepartment: number }[]>;
  filteredCareers: Observable<any[]>;

  fieldValidator: FieldValidator;
  constructor(
    private customerService: CustomersService,
    private careerService: CareerService,
    private callService: CallService,
    private departamentService: DepartamentsService,
    private mainCallData: MainCallDataServiceService
  ) { }

  ngOnInit() {
    this.fieldValidator = new FieldValidator();
    this.stateCtrl = new FormControl();
    this.cityCtrl = new FormControl();
    this.careerCtrl = new FormControl();

    this.loadDepartments(() => {
      this.loadCities();
    });
    this.loadCareers();
  }

  // Necesito enterarme de los cambios en currentCustomer para impactar los combos de city y departamento
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const customerChange = changes['currentCustomer'];
      if (customerChange) {
        const currentCustomer = (<Customer>customerChange.currentValue);
        if (currentCustomer && this.cities && this.departaments) {
          this.departmentSelected = this.departaments.find(d => d.id === currentCustomer.idDepartment);
          this.filteredCities = of(_.orderBy(this.cities.filter(c => c.idDepartment === this.departmentSelected.id), c => c.name));
          this.citySelected = this.cities.find(c => c.id === currentCustomer.idCity);
          this.careerSelected = this.careers.find(d => d.id === currentCustomer.idCareer);

          // TODO: resolverlo sin este hack. no encuentro una forma de que funcione sin esto:
          setTimeout(() => {
            this.citySelected = this.cities.find(c => c.id === currentCustomer.idCity);
          }, 0);
        }
      }
    }
  }

  callNumber(tel: string, index: number): void {
    this.changeIndexPhone.emit(index);
    this.callService.makeCallFromAgent(this.currentCustomer.id, tel).subscribe(
      response => {
        if (response.result === ResultCode.Error) {
          alert(response.message);
        }
      },
      error => {
        alert(error.message);
      }
    );
  }

  private loadDepartments(callback: () => void): void {
    this.departamentService.getAll().subscribe(
      d => {
        this.departaments = d.data;
        if (this.currentCustomer) {
          this.departmentSelected = this.departaments.find(dpto => dpto.id === this.currentCustomer.idDepartment);
        }
        this.filteredStates = this.stateCtrl.valueChanges
          .pipe(
            startWith<string>(''),
            map(value => value == null || typeof value === 'string' ? value : (<any>value).name),
            map(name => name
              ? this.filterStates(name)
              : this.departaments.slice())
          );
        callback();
      }
    );
  }

  private loadCities(): void {
    this.departamentService.getAllCities().subscribe(
      cities => {
        this.cities = cities.data;
        if (this.currentCustomer) {
          this.citySelected = this.cities.find(city => city.id === this.currentCustomer.idCity);
        }

        this.filteredCities = this.cityCtrl.valueChanges
          .pipe(
            startWith<string>(''),
            map(value => value == null || typeof value === 'string' ? value : (<any>value).name),
            map(name => name
              ? this.filterCities(name)
              : this.cities.filter(c => this.departmentSelected
                ? c.idDepartment === this.departmentSelected.id
                : c.idDepartment === 0).slice()));
      }
    );
  }

  private loadCareers(): void {
    this.careerService.getCareers().subscribe(
      careers => {
        this.careers = careers.data;
        if (this.currentCustomer) {
          const career = this.careers.find(c => c.id === this.currentCustomer.idCareer);
          if (career !== null) {
            this.careerSelected = career;
          }
        }
        this.filteredCareers = this.careerCtrl.valueChanges
          .pipe(
            startWith<string>(''),
            map(value => value == null || typeof value === 'string' ? value : (<any>value).name),
            map(name => name
              ? this.filterEntity(name, this.careers)
              : this.careers.slice())
          );
      }
    );
  }

  filterEntity(name: string, collection: any[]) {
    return collection.filter(entity =>
      entity.name.toLocaleLowerCase().indexOf(name.toLowerCase()) > -1);
  }

  filterCities(name: string) {
    return this.cities.filter(city =>
      city.name.toLocaleLowerCase().indexOf(name.toLowerCase()) > -1);
  }

  filterStates(name: string) {
    return this.departaments.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) > -1);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  public newPhone(): void {
    // this.editPhone.set("", true);
    this.currentCustomer.newPhone('');
  }

  public removeTel(tel: string): void {
    this.currentCustomer.removeTel(tel);
  }

  public saveCustomerData(): void {
    this.currentCustomer.idCity = this.citySelected  ? this.citySelected.id : 0;
    this.currentCustomer.idDepartment = this.departmentSelected  ? this.departmentSelected.id : 0;
    this.currentCustomer.idCareer = this.careerSelected ? this.careerSelected.id : 0;

    const tels = this.currentCustomer.getPhones();
    let wrongPhone = false;
    console.log(wrongPhone, tels);
    for (let i = 0; i < tels.length && !wrongPhone; i++) {
      wrongPhone = !this.fieldValidator.validatePhone(tels[i]);
      console.log(wrongPhone, tels[i]);
    }

    if (!wrongPhone) {
      this.customerService.updateCustomer(this.currentCustomer).subscribe(
        response => {
          if (response.result > 0) {
            alert('Los datos se guardaron correctamente');
            this.mainCallData.sendUpdateCustomerInfo(this.currentCustomer);
          } else {
            alert(response.message);
          }
        }
      );
    } else {
      alert('Uno de los telefonos no es correcto');
    }
  }

  departamentChanged() {
    if (this.cities) {
      this.citySelected = this.cities.find(c => c.id === 0);
    }
    if (!this.departmentSelected) {
      // no option selected

      // if (this.departaments) {
      //   this.departmentSelected = this.departaments.find(d => d.id === 0);
      // }
      if (this.cities) {
        this.filteredCities = of(this.cities);
      }
    } else if (typeof this.departmentSelected === 'string') {
      // already handled
      console.log(this.departmentSelected);
    } else {
      // already handled
      if (this.cities) {
        this.filteredCities = of(_.orderBy(this.cities.filter(c => c.idDepartment === this.departmentSelected.id), c => c.name));
      }
    }
  }

  // public selectedDepartamentChanged(selectedDept: any) {
  //   this.citySelected = null;
  //   this.filteredCities = of(_.orderBy(this.cities.filter(c => c.idDepartment === selectedDept.id), c => c.name));
  // }

  displayName(item?: any): string | undefined {
    return item ? item.name : undefined;
  }
}
