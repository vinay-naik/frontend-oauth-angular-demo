import { NgZone, Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of'
import { Subject } from 'rxjs/Subject';

import { oauthConfig } from './_config/oauth.config';

declare var firebase: any;

@Injectable()
export class TwitterAuth {	 //TWITTER DOES NOT HAVE A JAVASCRIPT API PRESENT HANCE USING FIREBASE. 

	userSignIn(): Observable<any> {
		var provider = new firebase.auth.TwitterAuthProvider();
		this.zone.run(() => {
			firebase.initializeApp(oauthConfig.firebaseConfig);
			firebase.auth().signInWithPopup(provider).then(response => {
				console.log(response); 
				if(response) {
					localStorage.setItem('forntend-oauth-user-key', response.credential.accessToken);
					localStorage.setItem('forntend-oauth-user-name', response.user.displayName);
					localStorage.setItem('forntend-oauth-user-image', response.additionalUserInfo.profile.profile_image_url_https);
					localStorage.setItem('forntend-oauth-user-email', response.user.email);
					return this.subject.next({ success: true, message: 'Login successfull' });
				} else {
					return this.subject.next({ success: false, message: 'Error fetching user data.' });					
				}
			  }).catch(error => {
					console.log(error);
					return this.subject.next({ success: false, message: "Failed to log in." });					
			  });
		});
		return this.subject;

	}

	constructor(private zone: NgZone, public subject: Subject<any>) {
		var e = document.createElement("script");
		e.type = "text/javascript";
		e.async = true;
		e.src = "https://www.gstatic.com/firebasejs/4.8.0/firebase.js";
		var t = document.getElementsByTagName("script")[0];
		t.parentNode.insertBefore(e, t);
	}

}