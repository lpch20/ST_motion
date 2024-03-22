import { FilterStep } from '../../../../../../../datatypes/filter/filter-step';
import { Type } from '@angular/core';

export interface Step extends FilterStep, StepCount {
  title: string;
  completed: boolean;
  class: Type<any>;
  enabled: boolean;
}

export interface StepCount {
  countIn: number;
  countFiltered: number;
  countLeftover: number;
}

export interface StepsSummary {
  initialCount: number;
  steps: Step[]
}