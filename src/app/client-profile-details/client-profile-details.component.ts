import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-client-profile-details',
  standalone: true,
  imports: [],
  templateUrl: './client-profile-details.component.html',
  styleUrl: './client-profile-details.component.css'
})
export class ClientProfileDetailsComponent {
  userProfile: any = {};
  userId: any = '';

  constructor(private userSerivce: UserService, private authService: AuthService) {
    this.userId = authService.sessionKeySubject.getValue();
  }

  async ngOnInit(): Promise<any> {
    this.userProfile = await this.userSerivce.findById(this.userId);
  }
}
