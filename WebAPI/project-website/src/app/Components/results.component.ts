import { Component, ViewChild,ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { AppService } from '../app.service';
import { Patient } from '../Models/Patient';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PatientResponse } from '../Models/PatientResponse';
import { ChartType, ChartOptions, ChartDataSets, ChartPoint, RadialChartOptions } from 'chart.js';
import { Label, SingleDataSet, Color } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { ToastrService } from 'ngx-toastr';
import { EditDiagComponent } from '../Dialogs/EditDiag.component';
import { DeleteDiagComponent } from '../Dialogs/DeleteDiag.component';

@Component({
  selector: 'Results',
  templateUrl: './results.component.html',
  styleUrls: ['../styles/results.component.css'],
})
export class ResultsComponent {
  constructor(private _appService: AppService, private toastr: ToastrService, public dialog: MatDialog) {
  }

  patientPerPrecondition = []
  appService = this._appService;
  ResultsDataSource = new MatTableDataSource();
  patientsForResults = new PatientResponse;
  columnsToDisplayForResults = ['select','id', 'sex', 'age', 'preconditions', 'riskScore', 'highRisk', 'edit'];
  loading: boolean = true;

  // Pie
  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      labels: {
        fontSize: 15
      }
    }
  };
  pieChartLabels: Label[] = ['Immunosuppressed', 'Pneumonia', 'Obesity', 'COPD', 'Hypertension', 'Diabetes', 'Renal Chronic'];
  pieChartData: SingleDataSet = [1, 2, 3, 4, 5, 6, 7];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartColors = [
    {
      backgroundColor: ['rgba(3, 80, 111, 1)', 'rgba(0, 175, 145, 1)', 'rgba(81, 194, 213, 1)',
        'rgba(199, 0, 57, 1)', 'rgba(255, 218, 119, 1)', 'rgba(89, 9, 149, 1)', 'rgba(255, 87, 34, 1)'],
    },
  ];
  pieChartPlugins = [];

  //line
  lineChartData: ChartDataSets[] = [{
    data: [],
    label: 'Risk Score',
    fill: false,
    lineTension: 0.1
  }];
  lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{
        type: 'linear',
        position: 'bottom',
        scaleLabel: {
          display: true,
          labelString: 'Age Of Patient'
        }
      }],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'Risk Score'
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 50,
          borderColor: 'red',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'High Risk Threshold',
            fontSize: 11
          }
        },
      ],
    },
  };
  lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(20, 92, 223, 1)',
      borderColor: 'rgba(3, 172, 231, 1)',
      pointBorderColor: '#fff'
    }];
  lineChartLegend = false;
  lineChartType: ChartType = 'line';
  lineChartPlugins = [pluginAnnotations];

  // Radar
  radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  radarChartLabels: Label[] = ['Immunosuppressed', 'Pneumonia', 'Obesity', 'COPD', 'Hypertension', 'Diabetes', 'Renal Chronic'];
  radarChartData: ChartDataSets[] = [
    {
      data: [], label: 'Male'
    },
    {
      data: [], label: 'Female'
    }
  ];
  radarChartType: ChartType = 'radar';

  //Bar
  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Sex Of Patient'
        }
      }], yAxes: [{
        ticks: {
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          labelString: 'Average Risk Score'
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  barChartLabels: Label[] = ['Male', 'Female'];
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [];//pluginDataLabels];
  barChartData: ChartDataSets[] = [
    { data: [], label: 'RiskScore' }
  ];
  barChartColors = [
    {
      backgroundColor: ['rgba(3, 172, 231, 1)', 'rgba(199, 0, 57, 1)'],
    },
  ];

  hideGraphs = true;
  toggleGraphText = "Show More";
  deleteHide = true;

  @ViewChild(MatPaginator) ResultsPaginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort, { static: false }) resultsSort!: MatSort;

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

    this.getPatients();

  }

  getPatients() {
      this.appService.GetPatients().subscribe(
        (data: PatientResponse) => {
          this.loading = false;
          this.pieChartData = data.patientsPerPrecondition;
          this.patientsForResults = data;
          this.populateLineChartData();
          this.populateRadarChartData();
          this.populateBarChartData();
          this.ResultsDataSource.data = this.patientsForResults.patients
          this.ResultsDataSource.sort = this.resultsSort
          this.ResultsDataSource.paginator = this.ResultsPaginator;
          this.DisableDelete()
        });
  }

  UpdateSelected(patient: Patient) {
    patient.deletePatient = !patient.deletePatient
    this.DisableDelete()
  }

  DisableDelete() {
    var broken = false;
    var patients = this.patientsForResults.patients
    for (var i = 0; i < patients.length; i++) {
      if (patients[i].deletePatient) {
        this.deleteHide = false;
        broken = true;
        break;
      }
    }
    if (!broken) {
      this.deleteHide = true;
    }
  }

  DeleteConfirmation() {

    var patients = this.patientsForResults.patients
    let patientsToDelete: Patient[] = []
    for (var i = 0; i < patients.length; i++) {
      if (patients[i].deletePatient) {
        patientsToDelete.push(patients[i]);
      }
    }

    const resultsDialogRef = this.dialog.open(DeleteDiagComponent, {
      width: '600px',
      data: { patients: patientsToDelete }
    });

    resultsDialogRef.afterClosed().subscribe(confirm => {
      if (this.appService.confirmDelete) {
        this.Delete(patientsToDelete);
      }
    });    
  }

  Delete(patientsToDelete: Patient[]) {

    this.appService.DeletePatients(patientsToDelete).subscribe(
      (data: PatientResponse) => {
        if (data.errorMessage == "") {
          this.toastr.success("Patients Successfully Deleted")
          this.getPatients()
        }
      },
      err => {
        this.toastr.error("Error Deleting Patients")
        console.log(err)
      });
  }

  toggleText() {
    if (this.hideGraphs) {
      this.toggleGraphText = "Show More"
    }
    else {
      this.toggleGraphText = "Show Less"
    }
  }

  applyResultsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ResultsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.ResultsDataSource.paginator) {
      this.ResultsDataSource.paginator.firstPage();
    }
  }

  populateLineChartData() {
    this.lineChartData[0].data = []
    this.patientsForResults.patients.sort((a, b) => (a.age > b.age) ? 1 : -1)
    for (var i = 0; i < this.patientsForResults.patients.length; i++) {
      var currentItem = this.patientsForResults.patients[i]
      let point: ChartPoint = { x: currentItem.age, y: currentItem.riskScore };
      (this.lineChartData[0].data as ChartPoint[]).push(point)
    }
  }

  populateRadarChartData() {
    var maleData = this.patientsForResults.malePatientsPerPrecondition;
    var femaleData = this.patientsForResults.femalePatientsPerPrecondition;
    this.radarChartData[0].data = maleData
    this.radarChartData[1].data = femaleData
  }

  populateBarChartData() {
    this.barChartData[0].data = [this.patientsForResults.maleAvgRiskScore, this.patientsForResults.femaleAvgRiskScore];
  }

  toggleMoreGraphs() {
    this.hideGraphs = !this.hideGraphs
    if (this.hideGraphs) {
      this.toggleGraphText = "Show More"
    }
    else {
      this.toggleGraphText = "Show Less"
    }
  }

  EditPatient(patient: Patient) {

    const resultsDialogRef = this.dialog.open(EditDiagComponent, {
      width: '600px',
      data: { patient: patient }
    });

    resultsDialogRef.afterClosed().subscribe(response => {
      this.getPatients()
      if (this.appService.ResultsEditMessage) {
        let patients: Patient[] = [patient];
        this.appService.MessagePatients(patients).subscribe(
          data => {
          },
          err => {
            this.toastr.error("Messaging Error")
            console.log(err)
          })
      }
    });
  }
}

