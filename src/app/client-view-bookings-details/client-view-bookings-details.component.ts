import { Component } from '@angular/core';
import { BookingService } from '../booking.service';
import { BehaviorSubject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import moment, { Moment } from "moment";
import { Location } from '@angular/common';

@Component({
  selector: 'app-client-view-bookings-details',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './client-view-bookings-details.component.html',
  styleUrl: './client-view-bookings-details.component.css'
})
export class ClientViewBookingsDetailsComponent {
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
