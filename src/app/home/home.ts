import {Component} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Http} from 'angular2/http';
import {AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';

import {User} from '../providers/user';

var backend = location.hostname === 'movies' ? 'http://api.averr.in' : 'https://api.averr.in';


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
    this.authHttp.get(`${backend}/movies`)
      .subscribe(
        data => {
          // this.movies = _.sortBy(data.json(), 'index');
          var d = data.json().sort((a, b) => {
            return b.index - a.index;
          });
          if (d != this.movies) {
            this.movies = d;
          }
          var f = <HTMLElement>document.querySelector('main');
          f.focus();
          setTimeout(() => this.fetchList(), 60 * 1000);
        },
        err => console.log(err),
        () => console.log('Complete')
      );
  }
  sendMovie() {
    this.submitted = true;
    this.authHttp.post(`${backend}/movies`, JSON.stringify(this.model))
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

  toggleSeen(movie) {
    movie.seen = !movie.seen;
    this.sendRate(movie);
  }

  rateMovie(movie, rate) {
    movie.rate = rate;
    this.sendRate(movie);
  }

  sendRate(movie) {
    this.authHttp.post(`${backend}/movies/${movie.imdbID}`,
      JSON.stringify({rate: movie.rate, seen: movie.seen}))
        .subscribe(
          data => {
            console.log('Complete');
          },
          err => console.log(err),
          () => console.log('Complete')
        );
  }

  delMovie(movie) {
    this.authHttp.delete(`${backend}/movies/${movie.imdbID}`)
        .subscribe(
          data => {
            this.movies.splice(this.movies.indexOf(movie), 1);
          },
          err => console.log(err),
          () => console.log('Complete')
        );
  }
}
