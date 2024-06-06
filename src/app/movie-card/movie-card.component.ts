import { Component, OnInit } from '@angular/core';
import {
  AllMoviesService,
  AddFavoriteMovieService,
  UserListService,
  RemoveFavoriteMovieService,
} from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  users: any[] = [];
  favorites: any[] = [];
  currentUser: any = null;

  showLeftArrow: boolean = false;
  showRightArrow: boolean = true;

  constructor(
    public fetchMovies: AllMoviesService,
    public addFavorite: AddFavoriteMovieService,
    public removeFavorite: RemoveFavoriteMovieService,
    public fetchUsers: UserListService,
    public snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.currentUser = JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );
    }
    this.getMovies();
    this.getUsers();
  }

  scroll(direction: number): void {
    const container = document.querySelector('.movie-grid');
    if (container) {
      const scrollAmount = direction * 300;
      container.scrollLeft += scrollAmount;
      this.updateArrowVisibility(container);
    }
  }

  updateArrowVisibility(container: any): void {
    this.showLeftArrow = container.scrollLeft > 0;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    this.showRightArrow = container.scrollLeft < maxScrollLeft;
  }

  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
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

  getUsers(): void {
    if (!this.currentUser) {
      console.error('localStorage is not available in this environment.');
      return;
    }
    const { Username } = this.currentUser;
    this.fetchUsers.getUserList().subscribe((resp: any) => {
      this.users = resp;
      const currentUser = this.users.find((user) => user.Username === Username);
      this.favorites = currentUser ? currentUser.FavoriteMovies : [];
    });
  }

  isFavorite(movie: any): boolean {
    return this.favorites.includes(movie.Title);
  }

  addTitleToFavorites(movie: any): void {
    if (!this.currentUser) {
      console.error('localStorage is not available in this environment.');
      return;
    }
    this.addFavorite.addFavoriteMovie(movie.Title).subscribe((resp: any) => {
      this.currentUser.FavoriteMovies.push(movie.Title);
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      this.favorites.push(movie.Title);
      this.snackBar.open('Movie added to favorites', 'Success', {
        duration: 2000,
      });
    });
  }

  removeTitleFromFavorites(movie: any): void {
    if (!this.currentUser) {
      console.error('localStorage is not available in this environment.');
      return;
    }
    this.removeFavorite
      .removeMovieFromFavorites(movie.Title)
      .subscribe((resp: any) => {
        this.currentUser.FavoriteMovies =
          this.currentUser.FavoriteMovies.filter(
            (title: string) => title !== movie.Title
          );
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.favorites = this.favorites.filter(
          (title: string) => title !== movie.Title
        );
        this.snackBar.open('Movie removed from favorites', 'Success', {
          duration: 2000,
        });
      });
  }
}
