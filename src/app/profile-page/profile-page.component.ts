import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';
import {
  AllMoviesService,
  UserListService,
  AddFavoriteMovieService,
  RemoveFavoriteMovieService,
} from '../fetch-api-data.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];
  username: string = '';

  constructor(
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    public fetchMovies: AllMoviesService,
    public fetchUsers: UserListService,
    public addFavorite: AddFavoriteMovieService,
    public removeFavorite: RemoveFavoriteMovieService
  ) {}

  ngOnInit(): void {
    this.getFavMovies();
  }

  openSynopsisDialog(movie: any): void {
    this.dialog.open(SynopsisComponent, {
      data: { movie },
      width: '600px',
    });
  }

  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: { movie },
      width: '600px',
    });
  }

  getFavMovies(): void {
    this.fetchMovies.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      const { Username, FavoriteMovies } = JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );
      this.username = Username;
      this.favorites = this.movies.filter((movie) =>
        FavoriteMovies.includes(movie._id)
      );
    });
  }

  removeTitleFromFavorites(movie: any): void {
    this.removeFavorite.removeMovieFromFavorites(movie._id).subscribe(
      (resp: any) => {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        user.FavoriteMovies = user.FavoriteMovies.filter(
          (title: string) => title !== movie._id
        );
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.favorites = this.favorites.filter(
          (favMovie) => favMovie._id !== movie._id
        );
        this.snackBar.open('Movie removed from favorites', 'Success', {
          duration: 2000,
        });
      },
      (error) => {
        console.error('Failed to remove movie from favorites:', error);
        this.snackBar.open(
          `Failed to remove movie from favorites: ${error.message}`,
          'Error',
          { duration: 2000 }
        );
      }
    );
  }
}
