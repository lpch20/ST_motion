import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CampaignService } from '../services/campaign.service';
import { QueueService } from '../services/queue.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'fury-manage-queue',
  templateUrl: './manage-queue.component.html',
  styleUrls: ['./manage-queue.component.scss']
})
export class ManageQueueComponent implements OnInit {

  constructor(private queueService: QueueService,
    private userService: UsersService,
    private serviceCampaigns: CampaignService) { }

  queueCtrl: FormControl;

  users: { id: number, firstname: string, lastname: string }[];
  queues: { id: number, name: string };
  campaigns: { id: number, name: string }[];
  usersInQueue: { id: number, firstname: string, lastname: string }[];
  campaignsInQueue: { id: number, name: string }[];

  // cola a la cual se va a asignar el usuario
  queueForSetUser: number;

  // usuario para cambiar de cola
  userForSetQueue: number;

  // cola a la cual se vuelcan los clientes de las campañas
  queueForSetCustomerCampaign: number;

  // campaña usada para volcar los clientes a la cola
  campaignForSetCustomerCampaign: number;

  queueForUsers: number;
  queueForCampaigns: number;

  ngOnInit() {


    this.queueCtrl = new FormControl('', {
      validators: Validators.required
    });

    const agentRole = 3;
    this.userService.getAllByRole(agentRole).subscribe(
      users => {
        this.users = users.data;
      }
    );
    this.queueService.getAll().subscribe(
      queues => {
        this.queues = queues.data;
      }
    );
    this.serviceCampaigns.getAll().subscribe(
      campaigns => {
        this.campaigns = campaigns.data;
      }
    );
  }

  assignUserToQueue() {

    if (this.queueForSetUser && this.userForSetQueue) {
      this.queueService.assignUserToQueue(this.queueForSetUser, this.userForSetQueue).subscribe(
        responseAssignUser => {
          if (responseAssignUser.result > 0) {
            alert('El usuario se actualizo de cola correctamente');
          } else {
            alert(responseAssignUser.message);
          }
        }
      );
    } else {
      alert('Debe seleccionar un usuario y una cola');
    }
  }

  assignCampaignToQueue() {
    if (this.queueForSetCustomerCampaign && this.campaignForSetCustomerCampaign) {
      this.queueService.assignCustomerFromCampaignToQueue(this.queueForSetCustomerCampaign, this.campaignForSetCustomerCampaign).subscribe(
        resultAssign => {
          console.log(resultAssign);
        }
      );
    } else {
      alert('Debe seleccionar una campaña y una cola');
    }
  }

  getUsers() {

    if (this.queueForUsers > 0) {
      this.queueService.getusersbyqueue(this.queueForUsers).subscribe(
        users => {
          this.usersInQueue = users.data;
          console.log(users);
        }
      );
    } else {
      alert('Debe seleccionar una cola');
    }
  }

  getCampaigns() {
    if (this.queueForCampaigns) {
      this.queueService.getCampaignsByQueue(this.queueForCampaigns).subscribe(
        campaigns => {
          this.campaignsInQueue = campaigns.data;
        }
      );
    } else {
      alert('Debe seleccionar una cola');
    }
  }
}
