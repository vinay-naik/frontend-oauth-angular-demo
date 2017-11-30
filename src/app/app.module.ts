import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatToolbarModule, MatSnackBarModule } from '@angular/material';
import 'hammerjs';

import { AuthGuard } from './_guards/auth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';

import { AppRoutingModule } from './route.config';
import { Subject } from 'rxjs/Subject';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		DashboardComponent,
		AboutComponent,
		HomeComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MatToolbarModule,
		MatSnackBarModule
	],
	providers: [
		AuthGuard,
		Subject
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
