import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { AppService } from '../app.service'
import { DialogData } from '../Models/EditDialogData';
import { PatientResponse } from '../Models/PatientResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'Edit-diag',
  templateUrl: './EditDiag.component.html',
  styleUrls: ['../styles/EditDiag.component.css']
})
export class EditDiagComponent {
  constructor(
    private _appService: AppService,
    public dialogRef: MatDialogRef<EditDiagComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  appService = this._appService
  patient = this.data.patient
  preconditionStr = "";
  message = false;
  phoneToolTipShown = false;

  ngOnInit() {
    this.preconditionStr = this.patient.preconditions.join('; ')
    this.appService.ResultsEditMessage = false;
  }

  PhoneTooltipToggle() {
    this.phoneToolTipShown = !this.phoneToolTipShown;
    console.log(this.phoneToolTipShown)
  }

  response = {
    success: false,
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.patient.preconditions = [this.preconditionStr]
    this.appService.UpdateValidation(this.patient).subscribe(
      (data: PatientResponse) => {
        if (data.errorMessage != "") {
          var errors = data.errorMessage.split("\n");
          errors.pop();
          for (var i = 0; i < errors.length; i++) {
            this.toastr.error(errors[i], "Data Validation Error:", {
              disableTimeOut: true,
            });
          }
        }
        else {
          this.response.success = true;
          // call message function
          this.dialogRef.close()
          if (this.message) {
            this.appService.ResultsEditMessage = true;
          }
        }
      },
      err => {
        this.toastr.error("Ensure the correct values are entered for each feild","Data Processing Error")
        console.log(err)
      })
  }

  AgeValidation() {
    var validation = false;
    validation = (this.patient.age && (this.patient.age < 0 || this.patient.age > 120)) ? false : true
    return validation
  }

}
