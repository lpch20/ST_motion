import { Component, ViewChild } from '@angular/core';
import { User } from '../../../../../../../datatypes/user';
import { BreakType } from '../../../../../../../datatypes/BreakType';
import { ScrollbarDirective } from '../../../../core/common/scrollbar/scrollbar.directive';

@Component({
  selector: 'agent-report',
  templateUrl: './agent-report.component.html',
  styleUrls: ['./agent-report.component.scss']
})
export class AgentReportComponent {
  users: User[];
  breaksType: BreakType[];

  @ViewChild('contentScroll', { read: ScrollbarDirective }) private contentScroll: ScrollbarDirective;
  constructor() { }
}