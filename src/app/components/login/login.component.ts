import { NgZone, NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GoogleAuth } from './auth/googleAuth.service';
import { FacebookAuth } from './auth/facebookAuth.service';
import { TwitterAuth } from './auth/twitterAuth.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

@Component({

	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	host: { 'class': 'layout-fill display-block' },
	providers: [GoogleAuth, FacebookAuth, TwitterAuth]
})
export class LoginComponent implements OnInit {

	private response = {};
	private returnUrl = '/dashboard';
	constructor(
		private route: ActivatedRoute,
		public snackBar: MatSnackBar,
		private googleAuth: GoogleAuth,
		private facebookAuth: FacebookAuth,
		private twitterAuth: TwitterAuth,
		private zone: NgZone,
		private router: Router) { 

	}

	openSnackBar(message: string, duration: number = 2000, action: string = '') {
		let config = {
			duration			: duration,
			verticalPosition	: 'top' as MatSnackBarVerticalPosition,
			horizontalPosition	: 'end' as MatSnackBarHorizontalPosition
		};
		this.snackBar.open(message, action, config);
	}

	authenticateCallback = response => {
		console.log(response);
		if(response.success) {
			this.zone.run(() => {
				this.router.navigate([this.returnUrl]);
			});
		}
	}

	authenticate = (provider) => {
		switch (provider) {
			case 'google':
				this.googleAuth.userSignIn().subscribe(this.authenticateCallback);
				break;
			case 'facebook':
				this.facebookAuth.userSignIn().subscribe(this.authenticateCallback);
				break;
			case 'twitter':
				this.twitterAuth.userSignIn().subscribe(this.authenticateCallback);
				break;

			default:
				this.openSnackBar('The provider "' + provider + '" has not been integrated yet.');
				break;
		}
	};

	logOut = () => {
		localStorage.setItem('forntend-oauth-user-key', '');
		localStorage.setItem('forntend-oauth-user-name', '');
		localStorage.setItem('forntend-oauth-user-image', '');
		localStorage.setItem('forntend-oauth-user-email', '');
	}

	ngOnInit() {
		this.logOut();
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
	}

}
