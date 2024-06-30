import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatCardModule,
    RouterModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  passwordFormGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{3,20}$')]),
    confirmPassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{3,20}$')])
  }, { validators: passwordMatchValidator });

  constructor(private authService: AuthService, private userService: UserService, private _snackBar: MatSnackBar) {
  }

  durationInSeconds = 5;
  openSnackBar() {
    this._snackBar.openFromComponent(PasswordChangeSnackBarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  async changePassword(): Promise<any> {
    const oldPasswordValue = this.oldPassword?.getRawValue();
    const passwordValue = this.password?.getRawValue();
    const sessionKey = this.authService.sessionKeySubject.getValue();
    if (sessionKey && oldPasswordValue) {
      let userData = await this.userService.findByIdAndPassword(sessionKey, oldPasswordValue);

      if (userData) {
        userData = {
          ...userData,
          password: passwordValue
        }
        this.userService.updateUser(userData);
        this.userService.updateUser(userData);
        this.openSnackBar();
      } else {
        console.error('old password is incorrect');
        this.passwordFormGroup.controls['oldPassword'].setErrors({ 'wrongPassword': "The old password is incorrect" });
      }
    }

  }

  get oldPassword() {
    return this.passwordFormGroup.get('oldPassword');
  }

  get password() {
    return this.passwordFormGroup.get('password');
  }

  get confirmPassword() {
    return this.passwordFormGroup.get('confirmPassword');
  }
}

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  return control.value.password !== control.value.confirmPassword ? { unmatchPassword: true } : null;
};

@Component({
  selector: 'snack-bar-password-change',
  templateUrl: 'snack-bar-password-change.html',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
})
export class PasswordChangeSnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
}