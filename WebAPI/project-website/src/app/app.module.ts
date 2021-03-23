//Angular
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, MatTooltipModule } from '@angular/material/tooltip';

//Third party
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { ChartsModule } from 'ng2-charts';

//Main pages
import { AppComponent } from './Components/app.component';
import { HRAComponent } from './Components/HRA.component'
import { ResultsComponent } from './Components/results.component';
import { AboutComponent } from './Components/about.component'
import { UserComponent } from './Components/user.component'
import { HomeComponent } from './Components/home.component'
import { RegistrationComponent } from './Components/registration.component'
import { LoginComponent } from './Components/login.component'
import { PageNotFoundComponent } from './Components/pageNotFound.component'

//Dialogs
import { HRADiagComponent } from './Dialogs/HRADiag.component';
import { EditDiagComponent } from './Dialogs/EditDiag.component';
import { DeleteDiagComponent } from './Dialogs/DeleteDiag.component';

//Service class
import { AppService } from './app.service';

//Routing
import { AppRoutingModule } from './Routing/app-routing.module';
import { AuthInterceptor } from './Routing/auth.interceptor';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    HRADiagComponent,
    DeleteDiagComponent,
    EditDiagComponent,
    HRAComponent,
    ResultsComponent,
    AboutComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    ChartsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    AppService, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerGestureConfig
    }
  ],
  bootstrap: [
    AppComponent,
    HRAComponent,
    ResultsComponent,
    AboutComponent,
    UserComponent,
    RegistrationComponent,
    PageNotFoundComponent,
    LoginComponent,
    HomeComponent,
    HRADiagComponent,
    EditDiagComponent,
    DeleteDiagComponent
  ]
})
export class AppModule { }
