import { Component, Inject } from '@angular/core';
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

export interface DialogData {
  email: string;
  password: string;
  confirmPassword: string
}

@Component({
  selector: 'app-login-register-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './login-register-dialog.component.html',
  styleUrl: './login-register-dialog.component.css'
})

export class LoginRegisterDialogComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  passwordFormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{3,20}$')]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{3,20}$')])
  }, { validators: passwordMatchValidator });
  loginPassword = new FormControl('', [Validators.required]);

  isloggedIn: boolean = false;
  role: string = '';

  currentStep = 'EnterEmail';

  constructor(
    public dialogRef: MatDialogRef<LoginRegisterDialogComponent>,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Subscribe to the observables provided by AuthService
    this.authService.isloggedIn.subscribe(isloggedIn => {
      //console.log(isloggedIn);
      this.isloggedIn = isloggedIn
    });
    this.authService.role.subscribe(role => {
      //console.log(role);
      this.role = role
    });
  }

  async submitEmail(): Promise<void> {
    const emailValue = this.email.getRawValue();
    if (emailValue) {
      if (await this.userService.findByEmail(emailValue)) {
        this.currentStep = "Login";
      } else {
        this.currentStep = "Register";
      }
    } else {
      console.log("email is invalid")
    }
  }

  async register(): Promise<void> {
    const password = this.passwordFormGroup.value.password;
    const confirmPassword = this.passwordFormGroup.value.confirmPassword;
    const emailValue = this.email.getRawValue();

    if (emailValue && password && password === confirmPassword) {
      if (await this.authService.register(emailValue, 'user', password)) {
        this.currentStep = "RegisterSuccess";
        this.email.setValue('');
        this.passwordFormGroup.setValue({
          password: '',
          confirmPassword: ''
        });
        this.loginPassword.setValue('');
      }
    } else {
      console.error("Error during register");
    }
  }

  async login(): Promise<void> {
    const emailValue = this.email.getRawValue();
    const passwordValue = this.loginPassword.getRawValue();
    if (emailValue && passwordValue) {
      try {
        if (await this.authService.login(emailValue, passwordValue)) {
          this.currentStep = "LoginSuccess";
          this.email.setValue('');
          this.passwordFormGroup.setValue({
            password: '',
            confirmPassword: ''
          });
          this.loginPassword.setValue('');
        }
      } catch (error: any) {
        if (error.name === 'wrongPassword') {
          this.loginPassword.setErrors({ wrongPassword: true });
        } else if (error.name === 'userNotFound') {
          this.loginPassword.setErrors({ userNotFound: true });
        }
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
    if (!this.isloggedIn) {
      this.currentStep = "EnterEmail";
    }
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