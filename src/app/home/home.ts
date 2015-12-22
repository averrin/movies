import {Component} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Http} from 'angular2/http';
import {AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';

import {User} from '../providers/user';


class MovieForm {
  constructor(
    public imdb: string
  ) {}
}

@Component({
  selector: 'home',
  directives: [ ...FORM_DIRECTIVES ],
  providers: [ User ],
  pipes: [],
  styles: [ require('./home.css') ],
  template: require('./home.html')
})
export class Home {
  // TypeScript public modifiers
  submitted = false;
  model = new MovieForm('');
  movies = [];
  constructor(public user: User, public http: Http, public authHttp: AuthHttp) {
    if (user.loggedIn()) {
      this.authHttp.get('http://api/movies')
        .subscribe(
          data => {
            this.movies = data.json();
          },
          err => console.log(err),
          () => console.log('Complete')
        );
    }
  }
  sendMovie() {
    this.submitted = true;
    this.authHttp.post('http://api/movies', JSON.stringify(this.model))
      .subscribe(
        data => {
          console.log(data.json());
          this.model.imdb = '';
          this.movies.unshift(data.json());
        },
        err => console.log(err),
        () => console.log('Complete')
      );
    console.log(this.model);
  }
  get diagnostic() { return JSON.stringify(this.model); }
}
