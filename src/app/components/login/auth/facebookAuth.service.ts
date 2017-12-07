import { NgZone, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of'
import { Subject } from 'rxjs/Subject';

import { oauthConfig } from './_config/oauth.config';

declare var FB: any;

@Injectable()
export class FacebookAuth {

	getUserDetails = access_token => {
		this.zone.run(() => {
			FB.api('/me?fields=id,name,email,picture', response =>  {
				if(response) {
					console.log(response);
					localStorage.setItem('forntend-oauth-user-key', access_token);
					localStorage.setItem('forntend-oauth-user-name', response.name);
					localStorage.setItem('forntend-oauth-user-image', response.picture.data.url);
					localStorage.setItem('forntend-oauth-user-email', response.email);
					return this.subject.next({ success: true, message: 'Login successfull' });				
				} else {
					return this.subject.next({ success: false, message: 'Import error - Error fetching user data.' });					
				}
			});
		});
	}

	userSignIn(): Observable<any> {
		this.zone.run(() => {
			FB.init({
				appId: oauthConfig.facebook.app_id,
				cookie: true,
				xfbml: true,
				version: oauthConfig.facebook.sdk_version
			})

			FB.login(response =>  {
				if (response.authResponse && response.authResponse.accessToken) {
					console.log(response);
					this.getUserDetails(response.authResponse.accessToken);
				} else {
					console.log('User cancelled login or did not fully authorize.');
					return this.subject.next({ success: false, message: "Failed to log in." });					
				}
			},{scope: 'email'});
		});
		return this.subject;

	}

	constructor(private zone: NgZone, public subject: Subject<any>) {
		var e = document.createElement("script");
		e.type = "text/javascript";
		e.async = true;
		e.src = "https://connect.facebook.net/en_US/sdk.js";
		var t = document.getElementsByTagName("script")[0];
		t.parentNode.insertBefore(e, t)
	}

}