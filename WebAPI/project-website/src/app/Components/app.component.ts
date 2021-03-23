import { Component, HostListener } from '@angular/core';
import { Local } from 'protractor/built/driverProviders';
import { AppService } from '../app.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../styles/app.component.css', '../styles/hamburgers.css']
})
export class AppComponent {
  constructor(private _appService: AppService) { }
  appService = this._appService
  title = 'project-website';
  burgerActive = false;

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 992) {
      this.burgerActive = false;
    }
  }

  ngOnInit() {

  }

  ToggleMobileMenu() {
    this.burgerActive = !this.burgerActive;
  }

  showNav() {
    if (this.appService._router.url == '/HRA' ||
      this.appService._router.url == '/Results' ||
      this.appService._router.url == '/About'
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  showProfile() {
    if (localStorage.getItem('token') != null) {
      return true
    }
    else {
      return false;
    }
  }

  HRA_nav() {
    this.burgerActive = false;
    this.appService._router.navigate(['/HRA']);
  }
  Home_nav() {
    this.burgerActive = false;
    this.appService._router.navigate(['/Home']);
  }
  Results_nav() {
    this.burgerActive = false;
    this.appService._router.navigate(['/Results']);
  }
  About_nav() {
    this.burgerActive = false;
    this.appService._router.navigate(['/About']);
  }

  onLogout() {
    this.burgerActive = false;
    this.appService.Logout()
  }
}
