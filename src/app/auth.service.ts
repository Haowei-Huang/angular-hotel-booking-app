import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

class CustomError extends Error {
  constructor(name: string, message: string, ...params: any) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = name;
    // Custom debugging information
    this.message = message;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UserService, private router: Router) {
    this.isloggedInSubject.next(false);
    this.sessionKeySubject.next('');
    this.roleSubject.next('');
  }

  isloggedInSubject = new BehaviorSubject<boolean>(true);
  sessionKeySubject = new BehaviorSubject<string>('');
  roleSubject = new BehaviorSubject<string>('');
  userDataSubject = new BehaviorSubject<any>({});

  isloggedIn = this.isloggedInSubject.asObservable();
  sessionKey = this.sessionKeySubject.asObservable();
  role = this.roleSubject.asObservable();
  userData = this.userDataSubject.asObservable();

  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    try {
      if (user) {
        if (user.password === password) {
          this.isloggedInSubject.next(true);
          this.sessionKeySubject.next(user._id);
          this.roleSubject.next(user.role);
          if (user.role === 'user') {
            this.userDataSubject.next(user);
          }
          console.log("Login user:" + user);
          return user;
        } else {
          console.error('Error: Password incorrect');
          throw new CustomError('wrongPassword', 'Error: Password incorrect');
        }
      } else {
        console.error('Error: User not found');
        throw new CustomError('userNotFound', 'Error: User not found');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async register(email: string, role: string, password: string): Promise<boolean> {
    console.log(email)
    console.log(password)

    const userdata = {
      email: email,
      role: role,
      password: password
    }

    return await this.userService.createUser(userdata);
  }

  logout() {
    this.isloggedInSubject.next(false);
    this.sessionKeySubject.next('');
    this.roleSubject.next('');
    this.userDataSubject.next({});
    this.router.navigate(['/']);
  }
}
