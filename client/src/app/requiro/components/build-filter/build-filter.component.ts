import { Component, ViewChild } from '@angular/core';
import { fadeOutAnimation } from '../../../core/common/route.animation';
import { StepsSummary, Step } from './steps/step';
import { ResultCode } from '../../../../../../datatypes/result';
import { CampaignsStepComponent } from './steps/campaign/campaigns-step.component';
import { CustomerAgeStepComponent } from './steps/customer-age/customer-age-step.component';
import { CustomerStateStepComponent } from './steps/customer-state/customer-state-step.component';
import { CustomerDebtStepComponent } from './steps/customer-debt/customer-debt-step.component';
import { CustomerAssignDateStepComponent } from './steps/customer-assign-date/customer-assign-date-step.component';
import { CustomerInteractionsStepComponent } from './steps/customer-interactions/customer-interactions-step.component';
import { CustomerDaysArrearsStepComponent } from './steps/customer-days-arrears/customer-days-arrears-step.component';
import { IUser } from '../../../../../../datatypes/user';
import { FiltersService } from '../../services/filters.service';
import { MatStepper } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'fury-build-filter',
  templateUrl: './build-filter.component.html',
  styleUrls: ['./build-filter.component.scss'],
  host: {
    '[@fadeOutAnimation]': 'true'
  },
  animations: [fadeOutAnimation]
})
export class BuildFilterComponent {

  @ViewChild('stepper') stepper: MatStepper;

  sortCompleted: boolean;
  usersCompleted: boolean;

  users: IUser[];
  steps: Step[];
  totalCustomersCount: number;

  inputs: any;
  outputs: any;
  filtering: boolean;

  constructor(private filtersService: FiltersService) {
    this.inputs = {
      step: {},
    };
    this.outputs = {
      filter: (event) => this.stepFiltered(event.step)
    };

    this.totalCustomersCount = 0;
    this.steps = [
      {
        title: 'Campañas', name: 'por-campania', class: CampaignsStepComponent,
        values: [], enabled: false, completed: false, countIn: 0, countFiltered: 0, countLeftover: 0
      },
      {
        title: 'Edad del cliente', name: 'rango-edad', class: CustomerAgeStepComponent,
        values: [], enabled: false, completed: false, countIn: 0, countFiltered: 0, countLeftover: 0
      },
      {
        title: 'Fecha de asignación', name: 'fecha-asignacion', class: CustomerAssignDateStepComponent,
        values: [], enabled: false, completed: false, countIn: 0, countFiltered: 0, countLeftover: 0
      },
      {
        title: 'Departamento', name: 'por-departamento', class: CustomerStateStepComponent,
        values: [], enabled: false, completed: false, countIn: 0, countFiltered: 0, countLeftover: 0
      },
      {
        title: 'Monto de deuda', name: 'monto-deuda', class: CustomerDebtStepComponent,
        values: [], enabled: false, completed: false,  countIn: 0, countFiltered: 0, countLeftover: 0
      },
      {
        title: 'Gestiones con el cliente', name: 'gestiones', class: CustomerInteractionsStepComponent,
        values: [], enabled: false, completed: false,  countIn: 0, countFiltered: 0, countLeftover: 0
      },
      {
        title: 'Días de atraso', name: 'dias-atraso', class: CustomerDaysArrearsStepComponent,
        values: [], enabled: false, completed: false,  countIn: 0, countFiltered: 0, countLeftover: 0
      }
    ];
    this.filtering = false;
  }

  stepFiltered(currStep: Step): void {

    const enabledSteps = this.getSteps();
    const enabledPreviousSteps = _.takeWhile(enabledSteps, s => s.title !== currStep.title);

    this.filtering = true;
    this.filtersService.filter(currStep, enabledPreviousSteps, this.users.map(u => u.id)).subscribe(
      res => {
        this.filtering = false;
        if (res.result === ResultCode.OK) {
          currStep.countFiltered = res.data.count;
          currStep.countLeftover = currStep.countIn - currStep.countFiltered;

          const index = enabledSteps.findIndex(s => s.title === currStep.title);
          if (enabledSteps.length === index + 1) {
            // set data to conclusion
          } else {
            enabledSteps[index + 1].countIn = currStep.countLeftover;
          }
        } else {
          // handle error
          console.error(res);
        }
      },
      error => {
        this.filtering = false;
        // handle error
          console.error(error);
      }
    );
  }

  getSteps() {
    return this.steps.filter(s => s.enabled);
  }

  sortChange(steps: Step[]): void {
    this.resetSteps();
  }

  stepChange(step: Step) {
    this.resetSteps();
  }

  resetSteps() {
    this.steps.forEach(step => {
      step.countIn = 0;
      step.countFiltered = 0;
      step.countLeftover = 0;
    });
    const enabledSteps = this.getSteps();
    if (enabledSteps.length > 0) {
      enabledSteps[0].countIn = this.totalCustomersCount;
    }
  }

  getStepsSummary(): StepsSummary {
    return { initialCount: this.totalCustomersCount, steps: this.steps };
  }

  agentsSelected(users: IUser[]): void {
    this.users = users;

    this.filtering = true;
    this.filtersService.getCountByUsers(users.map(u => u.id)).subscribe(
      res => {
        this.filtering = false;
        if (res.result === ResultCode.OK) {
          this.totalCustomersCount = res.data;
          this.stepper.next();
          this.resetSteps();
        } else {
          // handle error
          console.error(res);
        }
      },
      error => {
        // handle error
        this.filtering = false;
        console.error(error);
      }
    );
  }

  applyFilters(values: { reiniciar: boolean, steps: Step[] }) {
    this.filtering = true;
    this.filtersService.processFilter(values.steps, this.users.map(u => u.id), values.reiniciar).subscribe(
      res => {
        this.filtering = false;
        if (res.result === ResultCode.OK) {
          console.log(res);
          alert('procesamiento de filtros realizado con exito!');
        } else {
          // handle error
          console.error(res);
        }
      },
      error => {
        // handle error
        this.filtering = false;
        console.error(error);
      }
    );
  }
}
