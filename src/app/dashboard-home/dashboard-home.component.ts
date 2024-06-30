import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { BookingService } from '../booking.service';
import { HotelService } from '../hotel.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import moment, { Moment } from "moment";


@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatListModule, MatGridListModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent {
  userCount: number = 0;
  hotelCount: number = 0;
  bookingCount: number = 0;

  totalRevenue: number = 0;
  yesterdayRevenue: number = 0;
  lastWeekRevenue: number = 0;
  lastMonthRevenue: number = 0;

  constructor(private userService: UserService, private hotelService: HotelService, private bookingService: BookingService) {
  }

  async ngOnInit(): Promise<any> {
    await this.loadData();
  }

  async loadData(): Promise<any> {
    try {
      const users = await this.userService.findAll();
      this.userCount = users.length;

      const hotels = await this.hotelService.findAll();
      this.hotelCount = hotels.length;

      const bookings = await this.bookingService.findAll();
      this.bookingCount = bookings.length;

      const today = moment();
      const yesterday = today.subtract(1, 'day');
      const lastWeek = today.subtract(1, 'week');
      const lastMonth = today.subtract(1, 'month');

      if (this.bookingCount > 0) {
        this.totalRevenue = bookings.reduce((acc: any, booking: { totalPrice: any; }) => acc + booking.totalPrice, 0); // calculate the sum of earnings
        // use booking time to minus the corresponding filter time, if > 0, meaning it's after that time 
        const bookingToday = bookings.filter((booking: { time: moment.MomentInput; }) => moment(booking.time).diff(yesterday) > 0);
        const bookingLastWeek = bookings.filter((booking: { time: moment.MomentInput; }) => moment(booking.time).diff(lastWeek) > 0);
        const bookingMonth = bookings.filter((booking: { time: moment.MomentInput; }) => moment(booking.time).diff(lastMonth) > 0);

        // calculate the earnings of the filtered bookings
        this.yesterdayRevenue = bookingToday.reduce((acc: any, booking: { totalPrice: any; }) => acc + booking.totalPrice, 0);
        this.lastWeekRevenue = bookingLastWeek.reduce((acc: any, booking: { totalPrice: any; }) => acc + booking.totalPrice, 0);
        this.lastMonthRevenue = bookingMonth.reduce((acc: any, booking: { totalPrice: any; }) => acc + booking.totalPrice, 0);
      }


    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  }

}
