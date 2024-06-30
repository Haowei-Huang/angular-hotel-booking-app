import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { HotelService } from '../hotel.service';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Location } from '@angular/common';
import { BookingService } from '../booking.service';
import moment, { Moment } from "moment";

@Component({
  selector: 'app-dashboard-manage-bookings',
  standalone: true,
  imports: [MatButtonModule,
    MatTableModule,
    RouterLink,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule],
  templateUrl: './dashboard-manage-bookings.component.html',
  styleUrl: './dashboard-manage-bookings.component.css'
})
export class DashboardManageBookingsComponent {
  hotels: any[] = [];
  displayedColumns: string[] = ['_id', 'hotel', 'userId', 'time', 'from', 'to', 'totalPrice', 'CilentName', 'CilentEmail', 'CilentPhone', 'CardHolderName', 'CardNumber', 'Action'];
  dataToDisplay: any[] = [];
  dataSource = new BookingDataSource(this.dataToDisplay);

  currentBookingSubject: BehaviorSubject<any>;
  booking: any;

  constructor(private bookingService: BookingService, private hotelService: HotelService, private _location: Location, private router: Router, private route: ActivatedRoute) {
    this.currentBookingSubject = bookingService.currentBookingSubject;
  }

  async ngOnInit(): Promise<any> {
    await this.reloadData();
  }

  async reloadData(): Promise<any> {
    try {
      const bookingList = await this.bookingService.findAll();
      if (bookingList) {
        this.dataToDisplay = bookingList;

        const hotelIds = this.dataToDisplay.map(booking => booking.hotel);
        const hotelList = await this.hotelService.findByIds(hotelIds);
        this.hotels = hotelList;

        this.dataToDisplay = this.dataToDisplay.map(booking => {
          const hotelName = this.hotels.find(hotel => hotel._id === booking.hotel)?.HotelName || 'Hotel not found';
          return { ...booking, hotelName: hotelName };
        });

        this.dataSource.setData(this.dataToDisplay);
      } else {
        console.error('No data returned from bookingService.findAll()');
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  }

  formatDate(date: Moment) {
    return moment(date).format('MMMM d, y');
  }

  formatTime(time: Moment) {
    return moment(time).format('h:mm:ss a, MMMM d, y');
  }

  checkBookingDetails(booking: any, bookingId: string) {
    const hotel = this.hotels.find(hotel => hotel._id === booking.hotel);
    const rooms = hotel.Rooms.filter((room: { RoomId: string; }) => booking.rooms.includes(room.RoomId));
    delete booking.hotelName;

    this.currentBookingSubject.next({ ...booking, hotel: hotel, rooms: rooms });
    //console.log(this.currentBookingSubject.getValue())
    this.router.navigate(['./', bookingId], { relativeTo: this.route });
    console.log("going to booking details");
  }
}

class BookingDataSource extends DataSource<any> {
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