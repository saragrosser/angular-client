import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  registerUser(): void {
    // Ensure the birthday is formatted as an ISO string
    const formattedUserData = {
      Username: this.userData.Username,
      Password: this.userData.Password,
      Email: this.userData.Email,
      Birthday: new Date(this.userData.Birthday).toISOString(), // Convert to ISO string
    };

    console.log('Formatted User Data:', JSON.stringify(formattedUserData)); // Log data for verification

    this.fetchApiData.userRegistration(formattedUserData).subscribe(
      (response) => {
        this.dialogRef.close();
        this.snackBar.open('User registered successfully!', 'OK', {
          duration: 2000,
        });
      },
      (error) => {
        console.error('Registration error response:', error); // Log the full error response
        let errorMessage = 'Unknown error';
        if (error.status === 422) {
          errorMessage =
            error.error?.errors?.map((e: any) => e.msg).join(', ') ||
            errorMessage;
        } else if (error.error instanceof ProgressEvent) {
          errorMessage =
            'Network error: Please check your internet connection.';
        } else {
          errorMessage = JSON.stringify(error.error);
        }
        this.snackBar.open(`Error: ${errorMessage}`, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
