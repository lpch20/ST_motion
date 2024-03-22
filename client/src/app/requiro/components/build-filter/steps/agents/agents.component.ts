import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResultCode } from '../../../../../../../../datatypes/result';
import { Role } from '../../../../../../../../datatypes/enums';
import { IUser } from '../../../../../../../../datatypes/user';
import { UsersService } from '../../../../services/users.service';

@Component({
  selector: 'agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss'],

})
export class AgentsComponent implements OnInit {

  @Input() completed: boolean;
  @Output() completedChange: EventEmitter<boolean>;
  @Output() select: EventEmitter<IUser[]>;

  users: UserStep[];
  formGroup: FormGroup;

  constructor(private usersService: UsersService) {
    this.select = new EventEmitter();
    this.completedChange = new EventEmitter();
  }

  ngOnInit() {
    this.usersService.getAllByRole(Role.Agent).subscribe(
      res => {
        if (res.result == ResultCode.Error) {
          // handle error
        } else {
          this.users = res.data.map(c => { return { enabled: false, user: c }; });
        }
      },
      err => {
        // handle error
      }
    );
  }

  checkChange(campaign: UserStep): void {
    campaign.enabled = !campaign.enabled;
    this.completedChange.emit(this.users.some(u => u.enabled));
  }

  agentsSelected(): void {
    this.select.emit(this.users.filter(u => u.enabled).map(u => u.user));
  }
}

interface UserStep {
  enabled: boolean;
  user: IUser;
}
