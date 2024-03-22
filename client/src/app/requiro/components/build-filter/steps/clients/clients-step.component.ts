import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StepComponentBase } from '../stepComponent';

@Component({
  selector: 'clients-step',
  templateUrl: './clients-step.component.html',
  styleUrls: ['./clients-step.component.scss']
})
export class ClientsStepComponent extends StepComponentBase implements OnInit {

  @Input() completed: boolean;
  @Output() completedChange: EventEmitter<boolean>;

  formGroup: FormGroup;

  clients: { enabled: boolean, name: string }[];

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {

    this.formGroup = this.fb.group({
      phone: [],
    });

    this.completed = false;

    this.clients = [
      { enabled: false, name: "Creditos Directos" },
      { enabled: false, name: "Tarjeta D" },
      { enabled: false, name: "ANDA" },
      { enabled: false, name: "Clearing" }
    ];
  }

  checkChange(client: { enabled: boolean, name: string }): void {
  }
  
  getValues(): any[] {
    throw new Error("Method not implemented.");
  }
}
