import {Injectable} from 'angular2/core';
import {AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';
import {Http} from 'angular2/http';

declare var Auth0Lock;

@Injectable()
export class User {
  authorized: boolean;
  profile: string;
  lock = new Auth0Lock('twlrEXrCCA90CcN9ldq26S27zdFpESLd', 'averrin.auth0.com');
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(public http: Http, public authHttp: AuthHttp) {
    this.authorized = localStorage.getItem('profile') !== null;
    this.profile = JSON.parse(localStorage.getItem('profile')) || 'Unknown';
  }

  login() {
    this.lock.show((err: string, profile: string, id_token: string) => {

      if (err) {
        throw new Error(err);
      }

      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('id_token', id_token);
      this.profile = profile;
      this.authorized = localStorage.getItem('profile') !== null;

    });
  }

  logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
    this.profile = 'Unknown';
    this.authorized = localStorage.getItem('profile') !== null;
  }

  loggedIn() {
    return tokenNotExpired();
  }

  getThing() {
    this.http.get('http://api/ping')
      .subscribe(
        data => console.log(data.json()),
        err => console.log(err),
        () => console.log('Complete')
      );
  }

  getSecretThing() {
    this.authHttp.get('http://api/secured/ping')
      .subscribe(
        data => console.log(data.json()),
        err => console.log(err),
        () => console.log('Complete')
      );
  }

  tokenSubscription() {
    this.authHttp.tokenStream.subscribe(
        data => console.log(data),
        err => console.log(err),
        () => console.log('Complete')
      );
  }

  useJwtHelper() {
    var token = localStorage.getItem('id_token');

    console.log(
      this.jwtHelper.decodeToken(token),
      this.jwtHelper.getTokenExpirationDate(token),
      this.jwtHelper.isTokenExpired(token)
    );
  }
}
