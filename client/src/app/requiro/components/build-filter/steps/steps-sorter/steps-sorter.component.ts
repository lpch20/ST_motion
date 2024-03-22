import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortablejsOptions } from 'angular-sortablejs';
import 'sortablejs';
import { Step } from '../step';

@Component({
  selector: 'steps-sorter',
  templateUrl: './steps-sorter.component.html',
  styleUrls: ['./steps-sorter.component.scss'],

})
export class StepsSorterComponent implements OnInit {
  @Input() completed: boolean;
  @Output() completedChange: EventEmitter<boolean> = new EventEmitter();

  @Input() steps: Step[];
  @Output() stepsChange: EventEmitter<Step[]> = new EventEmitter();

  @Output() sortChange: EventEmitter<Step[]> = new EventEmitter();
  @Output() stepChange: EventEmitter<Step> = new EventEmitter();

  formGroup: FormGroup;

  simpleOptions: SortablejsOptions = {
    animation: 300,
    onSort: (event) => {
      this.sortChange.emit(this.steps);
    }
  };

  constructor(private fb: FormBuilder) {
    this.completed = false;
  }

  ngOnInit() {
    this.formGroup = this.fb.group({});
  }

  checkChange(s: Step) {
    s.enabled = !s.enabled;
    this.stepsChange.emit(this.steps);

    let c = this.steps.filter(s => s.enabled).length > 0;
    if (c != this.completed) {
      this.completed = c;
      this.completedChange.emit(this.completed)
    }

    this.stepChange.emit(s);
  }
}
