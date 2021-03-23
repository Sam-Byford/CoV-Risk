import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../app.service'
import { DialogData } from '../Models/HRADialogData';

@Component({
  selector: 'HRA-diag',
  templateUrl: './HRADiag.component.html',
  styleUrls: ['../styles/HRADiag.component.css']
})
export class HRADiagComponent {
  constructor(
    private _appService: AppService,
    public dialogRef: MatDialogRef<HRADiagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }
  appService = this._appService
  fileName = this.data.fileName
  message = false;

  ngOnInit() {
    this.message = false;
  }

  response = {
    messageUsers: false,
    uploadUsers: false
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.response.uploadUsers = true;
    this.response.messageUsers = this.message;
  }

}
