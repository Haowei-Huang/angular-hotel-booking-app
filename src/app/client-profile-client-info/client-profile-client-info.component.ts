import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client-profile-client-info',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatError],
  templateUrl: './client-profile-client-info.component.html',
  styleUrl: './client-profile-client-info.component.css'
})
export class ClientProfileClientInfoComponent {

  userProfile: any = {};
  userId: any = '';

  constructor(private userSerivce: UserService, private authService: AuthService, private _snackBar: MatSnackBar) {
    this.userId = authService.sessionKeySubject.getValue();
  }

  async ngOnInit(): Promise<any> {
    this.userProfile = await this.userSerivce.findById(this.userId);
    this.clientInfoGroup.setValue({ ...this.userProfile.clientInfo });
  }

  durationInSeconds = 5;
  openSnackBar() {
    this._snackBar.openFromComponent(ClientInfoChangeSnackBarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  clientInfoGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ,.'-]+$/i)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ,.'-]+$/i)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
  });

  async submitClientInfo(): Promise<any> {
    const newUserInfo = { ...this.userProfile, clientInfo: { ...this.clientInfoGroup.getRawValue() } };
    if (await this.userSerivce.updateUser(newUserInfo)) {
      this.openSnackBar();
      this.userProfile = await this.userSerivce.findById(this.userId);
      this.clientInfoGroup.setValue({ ...this.userProfile.clientInfo });
    }
  }

}

@Component({
  selector: 'snack-bar-clientInfo-change',
  templateUrl: 'snack-bar-clientInfo-change.html',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
})
export class ClientInfoChangeSnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
}
