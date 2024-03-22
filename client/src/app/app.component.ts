import { Component } from '@angular/core';
import { SidenavItem } from './core/sidenav/sidenav-item/sidenav-item.interface';
import { SidenavService } from './core/sidenav/sidenav.service';
import { MenuService } from './requiro/services/menu.service';

@Component({
  selector: 'fury-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(sidenavService: SidenavService,
    private menuService: MenuService) {

    const menuItems: SidenavItem[] = [];
    this.menuService.menuByRol().subscribe(
      response => {
        if (response.result > 0) {
          const menus = response.data;
          for (let i = 0; i < menus.length; i++) {
            menuItems.push({
              name: menus[i].label,
              routeOrFunction: menus[i].path,
              icon: menus[i].icon,
              position: menus[i].position,
              pathMatchExact: true
            });
          }
        }
        // Send all created Items to SidenavService
        sidenavService.setItems(menuItems);
      }
    );
  }
}
