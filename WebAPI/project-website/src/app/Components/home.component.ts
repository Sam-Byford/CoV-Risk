import { Component } from '@angular/core';
import { AppService } from '../app.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['../styles/home.component.css']
})
export class HomeComponent {
  constructor(private _appService: AppService, private toastr: ToastrService) { }
  title = 'project-website';
  HomeFlag = true;
  appService = this._appService;

  ngOnInit() {
    if (this.appService.UserDetails.userName == "") {
      this.appService.GetUserProfile().subscribe(
        (data: any) => {
          this.appService.UserDetails = data
        },
        err => {
          this.toastr.error('Failed To Fecth User Profile')
          console.log(err);
        }
      )
    }
  }

  HRA_Card_nav() {
    this.appService._router.navigate(['/HRA']);
  }
  Home_Card_nav() {
    this.appService._router.navigate(['/Home']);
  }
  Results_Card_nav() {
    this.appService._router.navigate(['/Results']);
  }
  About_Card_nav() {
    this.appService._router.navigate(['/About']);
  }

  onLogout() {
    this.appService.Logout()
  }
}
