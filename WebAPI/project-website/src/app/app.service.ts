import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { faUserMd, faChartPie, faTerminal, faHome, faUser, faInfoCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest } from '@angular/common/http'
import { PatientResponse } from './Models/PatientResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient } from './Models/Patient';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(public _router: Router, private httpClient: HttpClient, private fb: FormBuilder) { }
  private readonly pathAPI = 'http://localhost:5001/api/';//'https://cov19risk.azurewebsites.net/api/';
  readonly apiDownloadUrl = this.pathAPI + 'Algorithm/' + 'Download';
  readonly apiGetPatientsUrl = this.pathAPI + 'Algorithm/' + 'GetPatients';
  readonly apiPostPatientsUrl = this.pathAPI + 'Algorithm/' + 'UploadPatients'
  readonly apiRegisterUserUrl = this.pathAPI + 'Authentication/' + 'Register'
  readonly apiLoginUserUrl = this.pathAPI + 'Authentication/' + 'Login';
  readonly apiGetUserProfileUrl = this.pathAPI + 'UserProfile'
  readonly apiMessagePatientsUrl = this.pathAPI + 'Algorithm/' + 'MessagePatients'
  readonly apiUpdatePatientUrl = this.pathAPI + 'Algorithm/' + 'UpdatePatient'
  readonly apiDeletePatientsUrl = this.pathAPI + 'Algorithm/' + 'DeletePatients'

  faUserMd = faUserMd
  faChartPie = faChartPie
  faTerminal = faTerminal
  faHome = faHome
  faUser = faUser
  faInfoCircle = faInfoCircle
  faArrowRight = faArrowRight

  confirmDelete = false;
  ResultsEditMessage = false;

  UserDetails = {
    fullName: "",
    email: "",
    userName: ""
  }


  formModel = this.fb.group({
    UserName: ['', Validators.required],
    FullName: [''],
    Email: ['', [Validators.required, Validators.email]],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    },
    { validator: this.comparePasswords })
  });

  comparePasswords(fb: FormGroup) {
    let confirmPasswordCtrl = fb.get('ConfirmPassword');
    if (confirmPasswordCtrl?.errors == null || 'passwordMismatch' in confirmPasswordCtrl.errors) {
      if (fb.get('Password')?.value != confirmPasswordCtrl?.value) {
        confirmPasswordCtrl?.setErrors({ passwordMismatch: true })
      }
      else {
        confirmPasswordCtrl?.setErrors(null)
      }
    }
  }

  RegisterUser() {
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password
    }

    return this.httpClient.post(this.apiRegisterUserUrl, body)
  }

  login(formData: any) {
    return this.httpClient.post(this.apiLoginUserUrl, formData)
  }

  Logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/User']);
  }

  GetUserProfile() {
    return this.httpClient.get(this.apiGetUserProfileUrl)
  }

  UploadFile(files: any): Observable<any> {
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    return this.httpClient.post<PatientResponse>(this.apiPostPatientsUrl, formData)
  }

  MessagePatients(patients: Patient[]): Observable<any> {
    return this.httpClient.post<PatientResponse>(this.apiMessagePatientsUrl, patients)
  }

  DownloadFile(): Observable<any> {
    return this.httpClient.request(new HttpRequest(
      'GET',
      `${this.apiDownloadUrl}`,
      null,
      {
        responseType: 'blob'
      }));
  }

  GetPatients(): Observable<any> {
    return this.httpClient.get<PatientResponse>(this.apiGetPatientsUrl)
  }

  DeletePatients(patients: Patient[]): Observable<any> {
    return this.httpClient.post<PatientResponse>(this.apiDeletePatientsUrl, patients)
  }

  UpdateValidation(patient: Patient): Observable<any> {
    return this.httpClient.post<PatientResponse>(this.apiUpdatePatientUrl, patient)
  }

  public handleError(error: Response | any) {
    // In a real-world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
