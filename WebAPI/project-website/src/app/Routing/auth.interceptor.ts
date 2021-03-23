import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
import { AppService } from '../app.service';
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {
  };

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token') != null) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
      });
      return next.handle(clonedRequest).pipe(
        tap(
          succ => { },
          err => { // catches users who have a token but it has expired and therefore are no longer authorised
            if (err.status == 401) {
              localStorage.removeItem('token') // remove the expired token
              this.router.navigate(['/User']);
              this.toastr.error("Please Sign In To Access Application Features", "Unauthorized Request"), {
                timeOut: 10000,
              };
            }
          }
        )
      )
    }
    else {
      return next.handle(req.clone()).pipe(
        tap(
          succ => { },
          err => { // catches users who do not have a token and therefore are not signed in and have no authorisation
            if (err.status == 401) {
              this.router.navigate(['/User']);
              this.toastr.error("Please Sign In To Access Application Features", "Unauthorized Request");
            }
          }
        )
      );
    }
  }
}
