import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HRAComponent } from '../Components/HRA.component';
import { AppComponent } from '../Components/app.component';
import { ResultsComponent } from '../Components/results.component'
import { UserComponent } from '../Components/user.component';
import { RegistrationComponent } from '../Components/registration.component';
import { HomeComponent } from '../Components/home.component';
import { PageNotFoundComponent } from '../Components/pageNotFound.component'
import { LoginComponent } from '../Components/login.component';
import { AboutComponent } from '../Components/about.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/User', pathMatch: 'full' },
  { path: 'User', component: UserComponent },
  { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'HRA', component: HRAComponent, canActivate: [AuthGuard] },
  { path: 'Results', component: ResultsComponent, canActivate: [AuthGuard] },
  { path: 'About', component: AboutComponent }, // can access about without being logged in to find out more about the app
  { path: 'Registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
