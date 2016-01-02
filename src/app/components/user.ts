import {Component} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';

import {User} from '../providers/user';

@Component({
  selector: 'user-component',
  directives: [ ...FORM_DIRECTIVES ],
  providers: [ User ],
  pipes: [],
  styles: [ require('./user.css') ],
  template: require('./user.html')
})
export class UserComponent {
  constructor(public user: User) {
    // this.user = user;
    // console.log('hello component constructor');
  }
}
