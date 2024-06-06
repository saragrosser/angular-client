import { Component, OnInit, Inject } from '@angular/core';
import { DirectorService } from '../fetch-api-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
/**
 * Represents the Director Info Component.
 * This component is responsible for displaying information about a director,
 * including their details and associated movies.
 * @constructor
 * @param {MatDialogRef} dialogRef - Reference to the MatDialogRef for the component.
 * @param {DirectorService} fetchDirector - Service for fetching director information from the API.
 * @param {any} data - Data passed to the component, containing movie information.
 */
@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrl: './director-info.component.scss',
})
export class DirectorInfoComponent implements OnInit {
  director: any;
  movie: any;

  constructor(
    public dialogRef: MatDialogRef<DirectorInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.movie = data.movie;
    this.director = this.movie.Director; // Directly get director info from the movie data
  }

  ngOnInit(): void {
    console.log('Director Details:', this.director);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
