import { Injectable } from '@angular/core';

@Injectable()
export class SettingModulesService {
  getStatusModule(idModule: string): boolean {
    if (idModule === 'timer') {
      return false;
    } else if (idModule === 'break') {
      return true;
    } else {
      return false;
    }
  }
}
