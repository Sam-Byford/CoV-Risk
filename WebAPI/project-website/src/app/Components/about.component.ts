import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service'
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['../styles/about.component.css']
})
export class AboutComponent {
  constructor(private _appService: AppService, private toastr: ToastrService) { }
  appService = this._appService;
  AboutDataSource = new MatTableDataSource();
  columnsToDisplay = ['precondition', 'points'];

  @ViewChild('howTo', { static: false }) howTo!: ElementRef;
  @ViewChild('overview', { static: false }) overview!: ElementRef;
  @ViewChild('development', { static: false }) development!: ElementRef;
  @ViewChild('upload', { static: false }) upload!: ElementRef;
  @ViewChild('results', { static: false }) results!: ElementRef;
  @ViewChild('logging', { static: false }) logging!: ElementRef;
  @ViewChild('data', { static: false }) data!: ElementRef;
  @ViewChild('processing', { static: false }) processing!: ElementRef;
  @ViewChild('analysis', { static: false }) analysis!: ElementRef;

  ngOnInit() {
    this.AboutDataSource.data = [
      { condition: 'Pneumonia', points: '100' },
      { condition: 'Renal Chronic', points: '75' },
      { condition: 'Diabetes', points: '50' },
      { condition: 'Male', points: '40' },
      { condition: 'Age >= 50', points: '40' },
      { condition: 'Hypertension', points: '30' },
      { condition: 'Obesity', points: '30' },
      { condition: 'Immunosuppressed', points: '25' },
      { condition: 'COPD', points: '25' }
    ];
  }

  scrollToHowTo(): void {
    this.howTo.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  scrollToOverview(): void {
    this.overview.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  scrollToDevelopment(): void {
    this.development.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  scrollToUpload(): void {
    this.upload.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  scrollToResults(): void {
    this.results.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  scrollToLogging(): void {
    this.logging.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  scrollToDescription(): void {
    this.data.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  scrollToPreProcessing(): void {
    this.processing.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  scrollToAnalysis(): void {
    this.analysis.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  Login_Nav() {
    this.appService._router.navigate(['/User']);
  }
  HRA_Nav() {
    this.appService._router.navigate(['/HRA']);
  }
  Results_Nav() {
    this.appService._router.navigate(['/Results']);
  }

}
