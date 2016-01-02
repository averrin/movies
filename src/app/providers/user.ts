import {Injectable, EventEmitter, Output} from 'angular2/core';
import {AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';
import {Http} from 'angular2/http';

declare var Auth0Lock;

@Injectable()
export class User {
  authorized: boolean;
  profile: string;
  lock = new Auth0Lock('twlrEXrCCA90CcN9ldq26S27zdFpESLd', 'averrin.auth0.com');
  jwtHelper: JwtHelper = new JwtHelper();
  @Output() logged: EventEmitter<any> = new EventEmitter();
  @Output() loggedOut: EventEmitter<any> = new EventEmitter();

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
      this.logged.emit(null);

    });
  }

  logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
    this.profile = 'Unknown';
    this.authorized = localStorage.getItem('profile') !== null;
    this.loggedOut.emit(null);
  }

  loggedIn() {
    return tokenNotExpired();
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
