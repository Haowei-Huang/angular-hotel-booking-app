import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-manage-users',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, RouterLink, RouterModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule, ReactiveFormsModule, MatSelectModule, MatCardModule],
  templateUrl: './dashboard-manage-users.component.html',
  styleUrl: './dashboard-manage-users.component.css'
})
export class DashboardManageUsersComponent implements OnInit {

  userFormGroup = new FormGroup({
    _id: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{3,20}$')]),
    role: new FormControl('user', [Validators.required]),
  });

  displayedColumns: string[] = ['_id', 'email', 'password', 'role', 'action'];
  dataToDisplay: any[] = [];
  sessionKey: string | null = '';

  dataSource = new UserDataSource(this.dataToDisplay);

  constructor(private userService: UserService, private authService: AuthService) {
    console.log("manage user page loading");
  }

  async ngOnInit(): Promise<any> {
    await this.reloadData();
    // Subscribe to the observables provided by AuthService
    this.sessionKey = this.authService.sessionKeySubject.getValue();
    this.authService.sessionKey.subscribe(sessionKey => this.sessionKey = sessionKey);
  }

  updateDisabled(): boolean {
    const _idValue = this._id?.getRawValue();
    const emailValue = this.email?.getRawValue();
    if (!_idValue) return true; // If id is null, disable update button
    const existingUser = this.dataToDisplay.find(user => user.email.toLowerCase() === emailValue.toLowerCase());
    // Disable update if email exists with different id
    return existingUser && existingUser._id !== _idValue;
  };

  createDisabled(): boolean {
    const _idValue = this._id?.getRawValue();
    const emailValue = this.email?.getRawValue();
    if (_idValue) return true; // If id is not null, disable create button
    // Disable create if email already exists
    return this.dataToDisplay.some(user => user.email.toLowerCase() === emailValue.toLowerCase());
  };

  generatePassword(
    length = 20,
    characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
  ): any {
    return Array.from(crypto.getRandomValues(new Uint32Array(length))).map((x) => characters[x % characters.length]).join('');
  }

  async resetPassword(element: any): Promise<any> {
    const userData = { ...element, password: this.generatePassword() };
    //console.log(userData);
    if (await this.userService.updateUser(userData)) {
      this.resetForm();
      this.reloadData();
    }
  }

  async reloadData(): Promise<any> {
    try {
      const userList = await this.userService.findAll();
      if (userList) {
        this.dataToDisplay = userList;
        this.dataSource.setData(this.dataToDisplay);
      } else {
        console.error('No data returned from userService.findAll()');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }

  resetForm() {
    this.userFormGroup.setValue({
      _id: '',
      email: '',
      password: '',
      role: 'user'
    });
  }

  async onSubmit(): Promise<void> {
    const _id = this.userFormGroup.value._id;
    const password = this.userFormGroup.value.password;
    const role = this.userFormGroup.value.role;
    const email = this.userFormGroup.value.email;
    if (!_id) {
      if (this.dataToDisplay.findIndex(item => item.email.toLowerCase() === email?.toLowerCase()) !== -1) {
        this.userFormGroup.controls['email'].setErrors({ 'email': 'This email has been used by others' });
        return;
      }
    } else if (this.dataToDisplay.findIndex(u => u.email.toLowerCase() === email?.toLowerCase() && u._id !== _id) !== -1) {
      this.userFormGroup.controls['email'].setErrors({ 'email': 'This email has been used by others' });
      return;
    }

    if (email && password && role) {
      if (!_id) {
        const userdata = {
          email: email,
          role: role,
          password: password
        }
        if (await !this.userService.createUser(userdata)) {
          this.userFormGroup.setErrors({ 'network': "error during creating user" });
          console.error("error during creating user");
          return;
        }
      } else {
        const userdata = {
          _id: _id,
          email: email,
          role: role,
          password: password
        }
        if (await !this.userService.updateUser(userdata)) {
          this.userFormGroup.setErrors({ 'network': "error during updating user" });
          console.error("error during updating user");
          return;
        }
      }
    }

    this.resetForm();
    this.reloadData();
  }

  loadRow(element: any) {
    this.userFormGroup.setValue(element);
  }

  async deleteRow(element: any): Promise<void> {
    const emailValue = this.email?.getRawValue();
    if (this.sessionKey === element._id) {
      this.userFormGroup.controls['email'].setErrors({ 'email': 'You can\'t delete your own account' });
      return;
    }
    if (await this.userService.deleteUser(element)) {
      if (element.email === emailValue) {
        this.resetForm();
      }
      this.reloadData();
    }
  }

  get password() {
    return this.userFormGroup.get('password');
  }

  get _id() {
    return this.userFormGroup.get('_id');
  }

  get email() {
    return this.userFormGroup.get('email');
  }

  get role() {
    return this.userFormGroup.get('role');
  }
}

class UserDataSource extends DataSource<any> {
  private _dataStream = new ReplaySubject<any[]>();

  constructor(initialData: any[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<any[]> {
    return this._dataStream;
  }

  disconnect() { }

  setData(data: any[]) {
    this._dataStream.next(data);
  }
}
