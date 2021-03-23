import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from '../app.service';
import { DialogData } from '../Models/DeleteDialogData';

@Component({
  selector: 'Delete-diag',
  templateUrl: './DeleteDiag.component.html',
  styleUrls: ['../styles/DeleteDiag.component.css']
})
export class DeleteDiagComponent {
  constructor(
    public _appService: AppService,
    public dialogRef: MatDialogRef<DeleteDiagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }
  appService = this._appService;
  patients = this.data.patients
  DeleteDataSource = new MatTableDataSource();
  columnsToDisplay = ['id'];

  ngOnInit() {
    this.appService.confirmDelete = false;
    console.log(this.patients)
    this.DeleteDataSource.data = this.patients
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.appService.confirmDelete = true;
    this.dialogRef.close();
  }

}
