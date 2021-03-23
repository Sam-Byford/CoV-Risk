import { Component, HostBinding, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'Registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../styles/registration.component.css'],
})
export class RegistrationComponent {
  constructor(private _appService: AppService, private toastr: ToastrService) { }
  appService = this._appService

  ngOnInit() {
    this.appService.formModel.reset();
    if (localStorage.getItem('token') != null) {
      this.appService._router.navigate(['/Home']);
    }
  }

  onSubmit() {
    this.appService.RegisterUser().subscribe(
      (data: any) => {
        if (data.succeeded) {
          this.appService.formModel.reset();
          this.toastr.success('Registration Successful')
          this._appService._router.navigate(['/login']);
        }
        else {
          var errors = data.errors
          for (var i = 0; i < errors.length; i++) {
            this.toastr.error(errors[i].description, errors[i].code, {
              disableTimeOut: true,
              closeButton: true
            });
          }
        }
      },
      err => {
        this.toastr.error(err, 'Registration Error', {
          disableTimeOut: true,
          closeButton: true
        });
        console.log(err)
      }
    );
  }
}

