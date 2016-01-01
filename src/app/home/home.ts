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
  styles: [ require('./home.css'), require('./animate.css') ],
  template: require('./home.html')
})
export class Home {
  // TypeScript public modifiers
  submitted = false;
  model = new MovieForm('');
  movies = [];
  constructor(public user: User, public http: Http, public authHttp: AuthHttp) {
    this.movies = [];
    user.logged.subscribe((event) => {
      this.fetchList();
    });
    if (user.loggedIn()) {
      this.fetchList();
    }
  }
  fetchList() {
    this.authHttp.get('http://api.averr.in/movies')
      .subscribe(
        data => {
          this.movies = data.json();
        },
        err => console.log(err),
        () => console.log('Complete')
      );
  }
  sendMovie() {
    this.submitted = true;
    this.authHttp.post('http://api.averr.in/movies', JSON.stringify(this.model))
      .subscribe(
        data => {
          this.model.imdb = '';
          let d = data.json();
          d.author = this.user.profile;
          console.log(d);
          this.movies.unshift(d);
        },
        err => console.log(err),
        () => console.log('Complete')
      );
    console.log(this.model);
  }
  delMovie(movie) {
    this.authHttp.delete(`http://api.averr.in/movies/${movie.imdbID}`)
        .subscribe(
          data => {
            this.movies.splice(this.movies.indexOf(movie), 1);
          },
          err => console.log(err),
          () => console.log('Complete')
        );
    console.log(movie);
  }
}
