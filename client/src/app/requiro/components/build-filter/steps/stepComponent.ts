import { EventEmitter, Output, Input } from '@angular/core';
import { Step } from './step';

export interface IStepComponent {
    step: Step;
    filter: EventEmitter<{ step: Step }>;

    getValues(): any[];
}

export abstract class StepComponentBase implements IStepComponent {

    @Input() step: Step;
    @Output() filter: EventEmitter<{ step: Step }>;

    constructor() {
        this.filter = new EventEmitter<{ step: Step }>();
    }
    
    abstract getValues(): any[];

    applyFilter() {
        let values = this.getValues();
        this.step.values = values;
        this.filter.emit({ step: this.step });
    }
}
