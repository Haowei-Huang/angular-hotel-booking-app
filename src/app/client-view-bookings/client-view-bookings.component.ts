import { Component } from '@angular/core';
import { BookingService } from '../booking.service';
import { HotelDetailsComponent } from '../hotel-details/hotel-details.component';
import { HotelService } from '../hotel.service';
import { AuthService } from '../auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import moment, { Moment } from "moment";
import { MatCardModule } from '@angular/material/card';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-client-view-bookings',
  standalone: true,
  imports: [MatCardModule, ClientHeaderComponent],
  templateUrl: './client-view-bookings.component.html',
  styleUrl: './client-view-bookings.component.css'
})
export class ClientViewBookingsComponent {
  hotels: any[] = [];
  bookings: any[] = [];
  sessionKey: string | null = '';
  bookingSubject: BehaviorSubject<any>;

  // private isDataLoadedSubject = new BehaviorSubject<boolean>(false);
  // isDataLoadedObs = this.isDataLoadedSubject.asObservable();
  // isDataLoaded: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private bookingService: BookingService, private hotelService: HotelService, private authService: AuthService) {
    //this.isDataLoadedObs.subscribe(value => this.isDataLoaded = value);
    this.sessionKey = this.authService.sessionKeySubject.getValue();
    this.bookingSubject = this.bookingService.currentBookingSubject;
  }

  async ngOnInit(): Promise<any> {
    const bookingList = await this.bookingService.findByUser(this.sessionKey);
    this.bookings = bookingList;
    //console.log(this.bookings);

    const hotelIds = this.bookings.map(booking => booking.hotel);
    const hotelList = await this.hotelService.findByIds(hotelIds);
    this.hotels = hotelList;
    //this.isDataLoadedSubject.next(true);
    //console.log(this.hotels);

    this.bookings = this.bookings.map(booking => {
      const hotelName = this.hotels.find(hotel => hotel._id === booking.hotel)?.HotelName || 'Hotel not found';
      return { ...booking, hotelName: hotelName };
    });
  }

  checkDetails(booking: any) {
    const hotel = this.hotels.find(hotel => hotel._id === booking.hotel);
    const rooms = hotel.Rooms.filter((room: { RoomId: string; }) => booking.rooms.includes(room.RoomId));
    delete booking.hotelName;
    this.bookingSubject.next({ ...booking, hotel: hotel, rooms: rooms })
    this.router.navigate(['/myBookings', booking._id]);
  }

  formatDate(date: Moment) {
    return moment(date).format('MMMM d, y');
  }

  formatTime(time: Moment) {
    return moment(time).format('h:mm:ss a, MMMM d, y');
  }
}
