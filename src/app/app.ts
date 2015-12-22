/*
 * Angular 2 decorators and services
 */
import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES, CanActivate} from 'angular2/router';
import {Http} from 'angular2/http';
import {FORM_PROVIDERS} from 'angular2/common';
import {AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';

import {User} from './providers/user';
import {XLarge} from './directives/x-large';
import {Home} from './home/home';
import {UserComponent} from './components/user';


declare var Auth0Lock;
@CanActivate(() => tokenNotExpired())

/*
 * App Component
 * Top Level Component
 */
@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'app'
  selector: 'app', // <app></app>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [ ...FORM_PROVIDERS, User],
  // We need to tell Angular's compiler which directives are in our template.
  // Doing so will allow Angular to attach our behavior to an element
  directives: [ ...ROUTER_DIRECTIVES, UserComponent ],
  // We need to tell Angular's compiler which custom pipes are in our template.
  pipes: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styles: [`
    .title {
      font-family: Arial, Helvetica, sans-serif;
    }
    main {
      padding: 1em;
    }

  `],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  template: require('./main.html')
})
@RouteConfig([
  { path: '/', component: Home, name: 'Home' }
])

export class App {

  constructor(public http: Http, public authHttp: AuthHttp, public user: User) {
  }
}
