import { Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private DB_URL = import.meta.env['NG_APP_DB_URL'];
  private createOrUpdateApiUrl = this.DB_URL + '/document/createorupdate/bookings';
  private findAllApiUrl = this.DB_URL + '/document/findAll/bookings';

  private myHeaders = new Headers();

  bookingFormGroup = new FormGroup({
    hotel: new FormControl({}),
    from: new FormControl(moment()),
    to: new FormControl(moment().add(1, 'day')),
    duration: new FormControl(1),
    numberOfGuest: new FormControl(1),
    isBookingSuccess: new FormControl(false),
    rooms: new FormControl([]),
    totalPrice: new FormControl(0),

    clientInfo: new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
    }),

    cardInfo: new FormGroup({
      cardName: new FormControl(''),
      cardNumber: new FormControl(''),
      expDate: new FormControl(''),
      cvv: new FormControl(''),
      address: new FormGroup({
        street: new FormControl(''),
        city: new FormControl(''),
        province: new FormControl(''),
        postalCode: new FormControl(''),
        country: new FormControl(''),
      })
    })
  }
  );

  currentBookingSubject = new BehaviorSubject<any>({});
  currentBooking = this.currentBookingSubject.asObservable();

  constructor(private route: ActivatedRoute) {
    this.myHeaders.append("Content-Type", "application/json");
  }

  setHotel(hotel: any) {
    this.bookingFormGroup.patchValue({ "hotel": hotel });
  }

  get hotel() {
    return this.bookingFormGroup.value.hotel;
  }

  async createBooking(bookingData: any): Promise<any> {
    //console.log(userdata);
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: this.myHeaders,
      body: JSON.stringify({
        ...bookingData
      })
    };

    try {
      const response = await fetch(this.createOrUpdateApiUrl, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  async findAll(): Promise<any> {
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: this.myHeaders
    };

    try {
      const response = await fetch(this.findAllApiUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const bookingList = result['data'];

      if (bookingList) {
        return bookingList;
      } else {
        console.log('Not user found');
        return [];
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async findByUser(userId: any): Promise<any> {
    const bookingList = await this.findAll();
    const result = bookingList.filter((u: { userId: string; }) => u.userId === userId);
    return result;
  }
}
