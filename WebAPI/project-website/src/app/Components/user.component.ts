import { Component, HostBinding, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'User',
  templateUrl: './user.component.html',
  styleUrls: ['../styles/User.component.css'],
})
export class UserComponent {
  constructor(private _appService: AppService) { }
  appService = this._appService

  ngOnInit() {
    if (localStorage.getItem('token') != null) {
      this.appService._router.navigate(['/Home']);
    }
  }

  About_nav() {
    this.appService._router.navigate(['/About'])
  }
}
