import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import moment, { Moment } from "moment";
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private DB_URL = import.meta.env['NG_APP_DB_URL'];
  private findAllApiUrl = this.DB_URL + '/document/findAll/hotels';
  private myHeaders = new Headers();
  private _today = new BehaviorSubject<Moment>(moment());
  private _minDate = new BehaviorSubject<Moment>(moment().add(1, 'day'));

  public today = this._today.asObservable();
  public minDate = this._minDate.asObservable();

  currentHotelSubject = new BehaviorSubject<any>({});
  currentHotel = this.currentHotelSubject.asObservable();

  constructor(private router: Router) {
    this.myHeaders.append("Content-Type", "application/json");

    this.searchFormGroup.get('from')?.valueChanges.subscribe(newValue => {
      if (newValue) {
        const newMinDate = moment(newValue).add(1, 'day');
        this._minDate.next(newMinDate); // Update the BehaviorSubject with the new minimum date
        this.searchFormGroup.get('to')?.setValue(newMinDate); // Update 'to' without triggering another value change
      }
    });
  }

  searchFormGroup = new FormGroup({
    location: new FormControl(''),
    from: new FormControl(moment(), [Validators.required]),
    to: new FormControl(moment().add(1, 'day'), [Validators.required]),
    numberOfGuest: new FormControl(1, [Validators.required]),
    minPrice: new FormControl(0),
    maxPrice: new FormControl(500),
    tags: new FormControl([]),
    rating: new FormControl(0),
  });

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
      const hotelList = result['data'];

      if (hotelList) {
        return hotelList;
      } else {
        console.log('Not user found');
        return [];
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async findByIds(hotelIdList: any[]): Promise<any> {
    const hotelList = await this.findAll();
    const result = hotelList.filter((hotel: { _id: string; }) => hotelIdList.includes(hotel._id));
    return result;
  }
}
