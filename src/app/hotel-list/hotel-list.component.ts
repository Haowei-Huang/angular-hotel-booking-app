import { Component } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider'
import { Router, RouterModule } from '@angular/router';
import { HotelService } from '../hotel.service';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [
    SearchBarComponent,
    ClientHeaderComponent,
    MatDividerModule,
    MatListModule,
    MatPseudoCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatSliderModule,
    RouterModule],
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.css'
})

export class HotelListComponent {
  searchFormGroup: FormGroup;
  minPrice: number;
  maxPrice: number;
  hotelList: any[] = [];
  filteredList: any[] = [];

  constructor(private router: Router, private hotelService: HotelService, private bookingService: BookingService) {
    this.searchFormGroup = hotelService.searchFormGroup;
    this.minPrice = 0;
    this.maxPrice = 500;
    this.searchFormGroup.get('minPrice')?.valueChanges.subscribe(minPrice => this.minPrice = minPrice);
    this.searchFormGroup.get('maxPrice')?.valueChanges.subscribe(maxPrice => this.maxPrice = maxPrice);
    //this.searchFormGroup.valueChanges.subscribe(value => console.log(value));
  }

  async ngOnInit(): Promise<any> {
    this.hotelList = await this.hotelService.findAll();
    this.filterData(this.searchFormGroup.getRawValue());
    this.searchFormGroup.valueChanges.subscribe(newValue => this.filterData(newValue));
  }

  filterData(newValue: any) {
    const location = newValue.location;
    const numberOfGuest = newValue.numberOfGuest;
    const minPrice = newValue.minPrice;
    const maxPrice = newValue.maxPrice;
    const tags = newValue.tags;
    const rating = newValue.rating;

    const filteredList = this.hotelList.filter((hotel: { Address: { City: string; }; Rating: number; Rooms: any[]; Tags: any[]; }) => {
      // Filter by location
      if (hotel.Address.City.toLowerCase() !== location.toLowerCase()) {
        return false;
      }

      // Filter by minimum rating
      if (hotel.Rating < rating) {
        return false;
      }

      // only filter active rooms and rooms can serve enough guests
      const activeRooms = hotel.Rooms.filter((room: { isActive: boolean; SleepsCount: number; }) => room.isActive && room.SleepsCount >= numberOfGuest);
      if (activeRooms.length === 0) {
        return false; // No active rooms, skip this hotel
      }
      // if no room is in the price range, skip the hotel 
      const baseRates = activeRooms.map((room: { BaseRate: number; }) => room.BaseRate);
      const hasValidPrice = baseRates.some((rate: number) => (rate >= minPrice && rate <= maxPrice));
      //console.log(hasValidPrice);
      if (!hasValidPrice) {
        return false;
      }

      // Filter by tags
      if (tags.length > 0) {
        // first get hotel tags
        const hotelTags = new Set(hotel.Tags.map((tag: string) => tag.toLowerCase()));
        // get rooms' tag
        hotel.Rooms.forEach((room: { Tags: any[]; }) => {
          room.Tags.forEach((tag: string) => hotelTags.add(tag.toLowerCase()));
        });
        // convert tags to lower case
        const lowercaseHotelTags = Array.from(hotelTags);
        // check every search tag is included in the hotel's tags
        return tags.every((tag: string) => lowercaseHotelTags.some(hotelTag => hotelTag.includes(tag.toLowerCase())));
      }

      return true; // If no tags provided, return true for all hotels
    });

    this.filteredList = filteredList;
  }

  checkHotelDetails(hotel: any, hotelId: string) {
    this.bookingService.setHotel(hotel);
    this.router.navigate(['/hotels', hotelId]);
    console.log("going to hotel details");
  }

}
