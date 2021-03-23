import { Component, HostBinding, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { AppService } from '../app.service'
import { PatientResponse } from '../Models/PatientResponse';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Patient } from '../Models/Patient';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { HRADiagComponent } from '../Dialogs/HRADiag.component';

@Component({
  selector: 'HRA',
  templateUrl: './HRA.component.html',
  styleUrls: ['../styles/HRA.component.css'],
})
export class HRAComponent {
  constructor(private _appService: AppService, private toastr: ToastrService, public dialog: MatDialog) { }
  title = 'High Risk Analysis';
  showMore = false;
  appService = this._appService;
  patientResponse = new PatientResponse
  columnsToDisplay = ['id', 'sex', 'age', 'preconditions', 'riskScore', 'highRisk'];
  HRADataSource = new MatTableDataSource();
  loading: boolean = false;
  fileName = "";

  @ViewChild(MatPaginator) HRApaginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort, { static: false }) HRASort!: MatSort;
  @ViewChild('file', { static: false }) myInputVariable!: ElementRef;

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

  ToggleTemplate() {
    this.showMore = !this.showMore;
  }

  ResultsRoute() {
    this.appService._router.navigate(['/Results']);
  }

  AboutRoute() {
    this.appService._router.navigate(['/About']);
  }

  openDialog(files: any): void {
    const dialogRef = this.dialog.open(HRADiagComponent, {
      width: '450px',
      data: { fileName: files.files[0].name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.uploadUsers) {
          this.Upload(files, result.messageUsers)
        }
      }
      else {
        this.myInputVariable.nativeElement.value = "";
      }
    });
  }

  Upload(files: any, messageUsers: boolean) {
    this.patientResponse = new PatientResponse
    this.loading = true;
    this.showMore = false;
    setTimeout(() => {
      this.appService.UploadFile(files.files)
        .subscribe(
          (data: PatientResponse) => {
            this.patientResponse = data;
            this.loading = false;
            if (this.patientResponse.errorMessage == "") {
              this.toastr.success('Upload Success')
              this.HRADataSource.data = this.patientResponse.patients;
              this.HRADataSource.sort = this.HRASort
              this.HRADataSource.paginator = this.HRApaginator;
              if (messageUsers) {
                this.Message(this.patientResponse.patients);
              }
              this.myInputVariable.nativeElement.value = "";
            }
            else {
              var errors = this.patientResponse.errorMessage.split("\n");
              var errorPrefix = "";
              if (errors[0] == "DATA ERROR:") {
                errorPrefix = "Data Error"
              }
              else if (errors[0] == "UPLOAD ERROR:") {
                errorPrefix = "Upload Error"
              }
              else {
                errorPrefix = "Error"
              }
              errors.shift();
              errors.pop();
              for (var i = 0; i < errors.length; i++) {
                this.toastr.error(errors[i], errorPrefix, {
                  disableTimeOut: true,
                  closeButton: true
                });
              }
              this.myInputVariable.nativeElement.value = "";
            }
          },
          err => {
            this.toastr.error("Processing Error")
            this.myInputVariable.nativeElement.value = "";
            console.log(err);
          });
    }, 2000);
  }

  Message(patients: Patient[]) {
    this.appService.MessagePatients(patients)
      .subscribe(
        data => {
        },
        err => {
          this.toastr.error("Messaging Error")
          console.log(err);
        })
  }

  Download() {
    this.appService.DownloadFile().subscribe(
      data => {
        if (data.type == HttpEventType.Response) {
          const downloadedFile = new Blob([data.body], { type: 'text/csv' });
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none;');
          document.body.appendChild(a);
          a.download = "TemplateFile.csv";
          a.href = URL.createObjectURL(downloadedFile);
          a.target = '_blank';
          a.click();
          document.body.removeChild(a);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  applyHRAFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.HRADataSource.filter = filterValue.trim().toLowerCase();

    if (this.HRADataSource.paginator) {
      this.HRADataSource.paginator.firstPage();
    }
  }
}
