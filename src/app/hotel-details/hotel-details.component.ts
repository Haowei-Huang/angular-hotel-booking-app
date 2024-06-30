import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, ReplaySubject, map } from 'rxjs';
import { HotelService } from '../hotel.service';
import { BookingService } from '../booking.service';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import moment, { Moment } from "moment";
import { Location } from '@angular/common';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [MatInputModule, RouterModule, ClientHeaderComponent, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatListModule, MatTableModule, ReactiveFormsModule, FormsModule, MatSelectModule],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.css'
})
export class HotelDetailsComponent {
  searchFormGroup: FormGroup;
  bookingFormGroup: FormGroup;
  hotel: any;
  rooms: any[] = [];
  displayedColumns: string[] = ["Description", "BedOptions", "NumberOfGuest", "Price", "Select", "Reserve"];

  dataSource = new UserDataSource(this.rooms);

  constructor(private router: Router, private route: ActivatedRoute, private hotelService: HotelService, private bookingService: BookingService, private _location: Location) {
    this.hotel = bookingService.hotel;
    this.rooms = this.hotel.Rooms;
    this.searchFormGroup = hotelService.searchFormGroup;
    this.bookingFormGroup = bookingService.bookingFormGroup;
    this.bookingFormGroup.patchValue({ "hotel": this.hotel });
    this.dataSource.setData(this.rooms);
  }

  get numberOfGuest() {
    return this.searchFormGroup.value.numberOfGuest;
  }

  get duration() {
    const to = this.searchFormGroup.value.to;
    const from = this.searchFormGroup.value.from;
    return to.diff(from, 'days');
  }

  reserve() {
    let totalPrice = 0;
    const selectedRooms = this.bookingFormGroup.value.rooms;
    for (let i = 0; i < selectedRooms.length; i++) {
      totalPrice += selectedRooms[i].BaseRate * this.duration;
    }

    const currentValue = this.bookingFormGroup.value;
    const from = this.searchFormGroup.value.from;
    const to = this.searchFormGroup.value.to;
    const numberOfGuest = this.searchFormGroup.value.numberOfGuest;
    const hotelData = this.hotel;
    delete hotelData.Rooms;
    // console.log(currentValue);

    this.bookingFormGroup.patchValue({
      ...currentValue,
      hotel: hotelData,
      from: from,
      to: to,
      duration: this.duration,
      numberOfGuest: numberOfGuest,
      totalPrice: totalPrice
    });

    this.router.navigate(['booking'], { relativeTo: this.route });
    console.log("entering booking")
  }

  goBack() {
    this._location.back();
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
