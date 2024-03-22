import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { CustomersService } from '../../../requiro/services/customers.service';

@Component({
  selector: 'fury-toolbar-search',
  templateUrl: './toolbar-search.component.html',
  styleUrls: ['./toolbar-search.component.scss']
})
export class ToolbarSearchComponent implements OnInit {

  isOpen: boolean;

  @Input() textPaceHolder:string = "";
  @ViewChild('input', { read: ElementRef }) input: ElementRef;

  name:string = "";
  ci:string = "";
  phone:string = "";

  constructor(private customerService:CustomersService) {
  }

  ngOnInit() {
  }

  find():void{
    this.customerService.find(this.name,"",this.ci,this.phone).subscribe(
      response => {
        console.log(response);
      }
    )
    console.log(this.name,this.ci,this.phone);
  }

}
