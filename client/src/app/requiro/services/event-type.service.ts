import { Injectable } from '@angular/core';
import { EventType } from '../../../../../datatypes/eventType';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ResultWithData } from '../../../../../datatypes/result';

@Injectable()
export class EventTypeService {

  private evenTypeURL: string = '/api/customerEventType';
  private eventTypes:Array<EventType>;

  constructor(
    private http: HttpClient
  ) {
  }


  getAll():Observable<ResultWithData<EventType[]>> {
    return this.http.get<ResultWithData<EventType[]>>(this.evenTypeURL);
  }
  


/*
  constructor() { 
    this.eventTypes =  new Array<EventType>();

    
    this.eventTypes.push(new EventType(2,"Contacto Directo/Titular","<i class='material-icons'>how_to_reg</i>"));
    this.eventTypes.push(new EventType(3,"Contacto con Familiar","<i class='material-icons'>group</i>"));
    this.eventTypes.push(new EventType(5,"Contacto con Terceros","<i class='material-icons'>transfer_within_a_station</i>"));
    this.eventTypes.push(new EventType(8,"No conoce","<i class='material-icons'>contact_support</i>"));
    this.eventTypes.push(new EventType(9,"Ocupado","<i class='material-icons'>call_end</i>"));
    this.eventTypes.push(new EventType(4,"No contesta","<i class='material-icons'>phonelink_erase</i>"));
    this.eventTypes.push(new EventType(6,"Mensaje de Voz","<i class='material-icons'>record_voice_over</i>"));   
    
    
    //eventTypes.push({id:5,name:"Solicitud",icon:""});
    //this.eventTypes.push(new EventType(7,"Carta enviada","fa fa-envelope"));
  }
  */

  

  getEventByName(name:string):EventType{
    return this.eventTypes.filter(e => e.name === name)[0];
  }

  getEventById(id:number):EventType{
    return this.eventTypes.filter(e => e.id === id)[0];
  }

}
