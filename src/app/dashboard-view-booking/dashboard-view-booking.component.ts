import { Component } from '@angular/core';
import { BookingService } from '../booking.service';
import { BehaviorSubject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import moment, { Moment } from "moment";
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../hotel.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard-view-booking',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './dashboard-view-booking.component.html',
  styleUrl: './dashboard-view-booking.component.css'
})
export class DashboardViewBookingComponent {
  bookingSubject: BehaviorSubject<any>;
  booking: any;

  constructor(private bookingService: BookingService, private _location: Location) {
    this.bookingSubject = bookingService.currentBookingSubject;
    this.bookingService.currentBooking.subscribe(value => this.booking = value);
  }

  goBack() {
    this._location.back();
  }

  formatDate(date: Moment) {
    return moment(date).format('MMMM d, y');
  }

  formatTime(time: Moment) {
    return moment(time).format('h:mm:ss a, MMMM d, y');
  }
}
