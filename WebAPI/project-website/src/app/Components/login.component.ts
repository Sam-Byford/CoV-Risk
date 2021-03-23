import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['../styles/login.component.css']
})
export class LoginComponent {
  constructor(private _appService: AppService, private toastr: ToastrService) { }
  appService = this._appService;
  loading: boolean = false;
  formModel = {
    UserName: '',
    Password: ''
  }

  ngOnInit() {
    if (localStorage.getItem('token') != null) {
      this.appService._router.navigate(['/Home']);
    }
  }

  onSubmit(form: NgForm) {
    this.loading = true;
    this.appService.login(form.value).subscribe(
      (data: any) => {
        localStorage.setItem('token', data.token);       
        this.appService._router.navigate(['/Home']);
        this.loading = false;
      },
      err => {
        if (err.status == 400) {
          this.toastr.error('Incorrect Username Or Password', 'Authentication Failed');
        }
        else {
          this.toastr.error('Authentication Failed')
          console.log(err);
        }
        this.loading = false;
      }
    )
  }

}
