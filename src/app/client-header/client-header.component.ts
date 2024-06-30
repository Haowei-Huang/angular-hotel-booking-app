import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { LoginRegisterDialogComponent } from '../login-register-dialog/login-register-dialog.component';

export interface DialogData {
  email: string;
  password: string;
  confirmPassword: string
}

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, RouterModule],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.css'
})

export class ClientHeaderComponent implements OnInit {
  isloggedIn: boolean = false;
  role: string = '';

  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) {

  }

  ngOnInit() {
    // Subscribe to the observables provided by AuthService
    this.authService.isloggedIn.subscribe(isloggedIn => this.isloggedIn = isloggedIn);
    this.authService.role.subscribe(role => this.role = role);
    // console.log(this.isloggedIn);
    // console.log(this.role);
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginRegisterDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }
}
