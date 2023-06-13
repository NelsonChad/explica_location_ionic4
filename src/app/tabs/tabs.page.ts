import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public isExplainer = false;
  constructor(public auth: AuthService) {
    this.auth.isExplainer.subscribe(res => {
      this.isExplainer = res;
    });
  }

}
