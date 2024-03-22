import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FuryCardModule } from '../common/card/card.module';
import { ClickOutsideModule } from '../common/click-outside/click-outside.module';
import { MaterialModule } from '../common/material-components.module';
import { ScrollbarModule } from '../common/scrollbar/scrollbar.module';
import { ToolbarFullscreenToggleComponent } from './toolbar-fullscreen-toggle/toolbar-fullscreen-toggle.component';
import { ToolbarNotificationsComponent } from './toolbar-notifications/toolbar-notifications.component';
import { ToolbarQuickpanelToggleComponent } from './toolbar-quickpanel-toggle/toolbar-quickpanel-toggle.component';
import { ToolbarSearchBarComponent } from './toolbar-search-bar/toolbar-search-bar.component';
import { ToolbarSearchComponent } from './toolbar-search/toolbar-search.component';
import { ToolbarSidenavMobileToggleComponent } from './toolbar-sidenav-mobile-toggle/toolbar-sidenav-mobile-toggle.component';
import { ToolbarUserButtonComponent } from './toolbar-user-button/toolbar-user-button.component';
import { ToolbarComponent } from './toolbar.component';
import { SearchCustomerComponent } from '../../requiro/search-customer/search-customer.component';
import { ScheduleComponent } from '../../requiro/toolbar/schedule/schedule.component';
import { QuickPanelToggleComponent } from '../../requiro/toolbar/quick-panel-toggle/quick-panel-toggle.component';
import { QuickPanelComponent } from '../../requiro/toolbar/quick-panel/quick-panel.component';
import { CallPlayerComponent } from '../../requiro/components/toolbar/call-player/call-player.component';
import { UserButtonComponent } from '../../requiro/components/toolbar/user-button/user-button.component';
import { BreakSelectorComponent } from '../../requiro/toolbar/break-selector/break-selector.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    FuryCardModule
  ],
  declarations: [
    CallPlayerComponent,
    UserButtonComponent,
    ToolbarComponent,
    SearchCustomerComponent,
    ScheduleComponent,
    BreakSelectorComponent,
    QuickPanelComponent,
    QuickPanelToggleComponent,    
    ToolbarNotificationsComponent,
    ToolbarSearchComponent,
    ToolbarSearchBarComponent,
    ToolbarQuickpanelToggleComponent,
    ToolbarFullscreenToggleComponent,
    ToolbarSidenavMobileToggleComponent,
    ToolbarUserButtonComponent
  ],
  exports: [ToolbarComponent]
})
export class ToolbarModule {
}
