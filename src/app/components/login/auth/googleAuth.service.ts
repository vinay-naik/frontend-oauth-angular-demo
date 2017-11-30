import { NgZone, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of'
import { Subject } from 'rxjs/Subject';

import { oauthConfig } from './_config/oauth.config';

declare var gapi: any;
declare var System: any;

@Injectable()
export class GoogleAuth {

	getUserDetails = (access_token) => {
		var clientObject = gapi.client.plus.people.get({
			userId: "me"
		});
		this.zone.run(() => {
			clientObject.execute(response => {
				console.log(response);
				if (response.error) {
					console.log('Import error - Error fetching user data.', response);
					return this.subject.next({ success: false, message: 'Import error - Error fetching user data.' });
				} else if (response.id) {
					localStorage.setItem('forntend-oauth-user-key', access_token);
					localStorage.setItem('forntend-oauth-user-name', response.displayName);
					localStorage.setItem('forntend-oauth-user-image', response.image.url);
					localStorage.setItem('forntend-oauth-user-email', response.emails[0].value);
					return this.subject.next({ success: true, message: 'Login successfull' });
				}
			});
		});
	}

	googleSignInCallback = loginResponse => {
		let userPrompt = loginResponse['status']['method'] == 'PROMPT' ? loginResponse['status']['method'] : false;
		if (userPrompt) {
			console.log(loginResponse);
			let access_token = loginResponse && loginResponse['access_token'] ? loginResponse['access_token'] : null;
			let signedIn = loginResponse && loginResponse['status'] && loginResponse['status']['signed_in'] ? loginResponse['status']['signed_in'] : false;

			if (access_token && access_token) {
				gapi.client.load("plus", "v1", response => {
					this.getUserDetails(access_token);
				});
			} else {
				console.error("Failed to log in.");
				return this.subject.next({ success: false, message: "Failed to log in." });
			}
		}
	}

	userSignIn(): Observable<any> {
		this.zone.run(() => {
			gapi.auth.signIn({
				callback: this.googleSignInCallback,
				cookiepolicy: "single_host_origin",
				clientid: oauthConfig.google.client_id,
				requestvisibleactions: "http://schema.org/AddAction",
				scope: oauthConfig.google.scope
			});
		})

		return this.subject;

	}

	constructor(private zone: NgZone, public subject: Subject<any>) {
		var e = document.createElement("script");
		e.type = "text/javascript";
		e.async = true;
		e.src = "https://apis.google.com/js/client:platform.js?onload=gPOnLoad";
		var t = document.getElementsByTagName("script")[0];
		t.parentNode.insertBefore(e, t)
	}

}