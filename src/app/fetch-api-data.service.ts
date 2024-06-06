import { Injectable } from '@angular/core';
// import { catchError } from 'rxjs/internal/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movie-ghibli-api-60afc8eabe21.herokuapp.com';

@Injectable({
  providedIn: 'root',
})
// Service to handle errors and extract response data
export class ErrorAndResponseService {
  constructor(protected http: HttpClient) {}

  // Method to handle HTTP errors
  protected handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error occurred:', error.error.message);
    } else {
      // Server-side error
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    // Return an observable with an error message
    const err = new Error('Something went wrong, please try again later.');
    throwError(() => err);
  }
  protected extractResponseData(res: any): any {
    return res || {}; // Return the response body or an empty object
  }
}

@Injectable({
  providedIn: 'root',
})
// USER REGISTRATION
export class UserRegistrationService extends ErrorAndResponseService {
  constructor(http: HttpClient) {
    super(http);
  }

  public userRegistration(userDetails: any): Observable<any> {
    console.log('User Details:', JSON.stringify(userDetails));

    return this.http
      .post(apiUrl + '/users', userDetails, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
}

@Injectable({
  providedIn: 'root',
})

// USER LOGIN
export class UserLoginService extends ErrorAndResponseService {
  constructor(http: HttpClient) {
    super(http);
  }
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + '/login', userDetails, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
}

@Injectable({
  providedIn: 'root',
})
// GET ALL MOVIES
export class AllMoviesService extends ErrorAndResponseService {
  constructor(http: HttpClient) {
    super(http);
  }
  public getAllMovies(): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');

      return this.http
        .get(apiUrl + '/movies', {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        })
        .pipe(map(this.extractResponseData), catchError(this.handleError));
    } else {
      console.error('localStorage is not available in this environment.');
      return throwError(
        () => new Error('localStorage is not available in this environment.')
      );
    }
  }
}

// GET ONE MOVIE BY TITLE
export class OneMovieService extends ErrorAndResponseService {
  constructor(http: HttpClient) {
    super(http);
  }
  public getOneMovie(title: string): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');

      return this.http
        .get(apiUrl + 'movies/' + title, {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        })
        .pipe(map(this.extractResponseData), catchError(this.handleError));
    } else {
      console.error('localStorage is not available in this environment.');
      return throwError(
        () => new Error('localStorage is not available in this environment.')
      );
    }
  }
}
// GET MOVIES BY GENRE
export class MoviesByGenreService extends ErrorAndResponseService {
  constructor(http: HttpClient) {
    super(http);
  }
  public getMoviesByGenre(genre: string): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');

      return this.http
        .get(apiUrl + '/movies/genre/' + genre, {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        })
        .pipe(map(this.extractResponseData), catchError(this.handleError));
    } else {
      console.error('localStorage is not available in this environment.');
      return throwError(
        () => new Error('localStorage is not available in this environment.')
      );
    }
  }
}

// GET MOVIES BY DIRECTORS NAME
export class MoviesByDirectorService extends ErrorAndResponseService {
  constructor(http: HttpClient) {
    super(http);
  }
  public getMoviesByDirector(directorName: string): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');

      return this.http
        .get(apiUrl + '/movies/director/' + directorName, {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        })
        .pipe(map(this.extractResponseData), catchError(this.handleError));
    } else {
      console.error('localStorage is not available in this environment.');
      return throwError(
        () => new Error('localStorage is not available in this environment.')
      );
    }
  }
}

@Injectable({
  providedIn: 'root',
})
// GET DIRECTOR
export class DirectorService extends ErrorAndResponseService {
  constructor(http: HttpClient) {
    super(http);
  }
  public getDirector(name: string): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');

      return this.http
        .get(apiUrl + '/movies/director/' + name, {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        })
        .pipe(map(this.extractResponseData), catchError(this.handleError));
    } else {
      console.error('localStorage is not available in this environment.');
      return throwError(
        () => new Error('localStorage is not available in this environment.')
      );
    }
  }
}

@Injectable({
  providedIn: 'root',
})
// ADD == POST MOVIE TO FAVORITE LIST
export class AddFavoriteMovieService extends ErrorAndResponseService {
  constructor(http: HttpClient) {
    super(http);
  }

  public addFavoriteMovie(movieId: string): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const { Username } = JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + token,
      });

      return this.http
        .post(apiUrl + '/users/' + Username + '/movies/' + movieId, null, {
          headers,
        })
        .pipe(map(this.extractResponseData), catchError(this.handleError));
    } else {
      console.error('localStorage is not available in this environment.');
      return throwError(
        () => new Error('localStorage is not available in this environment.')
      );
    }
  }
}
@Injectable({
  providedIn: 'root',
})
// DELETE MOVIE FROM FAVORITE LIST
export class RemoveFavoriteMovieService extends ErrorAndResponseService {
  constructor(http: HttpClient) {
    super(http);
  }
  public removeMovieFromFavorites(title: string): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const { Username } = JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + token,
      });
      return this.http
        .delete(apiUrl + '/users/' + Username + '/movies/' + title, {
          headers,
        })
        .pipe(map(this.extractResponseData), catchError(this.handleError));
    } else {
      console.error('localStorage is not available in this environment.');
      return throwError(
        () => new Error('localStorage is not available in this environment.')
      );
    }
  }
}

@Injectable({
  providedIn: 'root',
})
// DELETE USER
export class DeleteUserService extends ErrorAndResponseService {
  constructor(http: HttpClient) {
    super(http);
  }

  public deleteUser(): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const { _id } = JSON.parse(localStorage.getItem('currentUser') || '{}');

      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + token,
      });
      return this.http
        .delete(apiUrl + '/users/' + _id, {
          headers,
        })
        .pipe(map(this.extractResponseData), catchError(this.handleError));
    } else {
      console.error('localStorage is not available in this environment.');
      return throwError(
        () => new Error('localStorage is not available in this environment.')
      );
    }
  }
}

@Injectable({
  providedIn: 'root',
})
// UPDATE USER BY USERNAME
export class UpdateInfoUserService extends ErrorAndResponseService {
  constructor(http: HttpClient) {
    super(http);
  }
  public updateInfoUser(userData: any): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const { Username } = JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + token,
      });

      return this.http
        .put(apiUrl + '/users/' + Username, userData, {
          headers,
        })
        .pipe(map(this.extractResponseData), catchError(this.handleError));
    } else {
      console.error('localStorage is not available in this environment.');
      return throwError(
        () => new Error('localStorage is not available in this environment.')
      );
    }
  }
}

@Injectable({
  providedIn: 'root',
})
// GET USER LIST
export class UserListService extends ErrorAndResponseService {
  constructor(http: HttpClient) {
    super(http);
  }
  public getUserList(): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return this.http
        .get(apiUrl + '/users', {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        })
        .pipe(map(this.extractResponseData), catchError(this.handleError));
    } else {
      console.error('localStorage is not available in this environment.');
      return throwError(
        () => new Error('localStorage is not available in this environment.')
      );
    }
  }
}
