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
@Component({
  selector: 'app-dashboard-manage-hotels',
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
  templateUrl: './dashboard-manage-hotels.component.html',
  styleUrl: './dashboard-manage-hotels.component.css'
})
export class DashboardManageHotelsComponent {
  displayedColumns: string[] = ['_id', 'HotelName', 'Rating', 'Street', 'City', 'Province', 'PostalCode', 'Country', 'Action'];
  dataToDisplay: any[] = [];
  sessionKey: string | null = '';

  dataSource = new HotelDataSource(this.dataToDisplay);

  currentHotelSubject: BehaviorSubject<any>;
  hotel: any;

  constructor(private hotelService: HotelService, private _location: Location, private router: Router, private route: ActivatedRoute) {
    this.currentHotelSubject = hotelService.currentHotelSubject;
    //this.hotelService.currentHotel.subscribe(value => this.hotel = value);
  }

  async ngOnInit(): Promise<any> {
    await this.reloadData();
  }

  async reloadData(): Promise<any> {
    try {
      const hotelList = await this.hotelService.findAll();
      if (hotelList) {
        this.dataToDisplay = hotelList;
        this.dataSource.setData(this.dataToDisplay);
      } else {
        console.error('No data returned from hotelService.findAll()');
      }
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    }
  }

  checkHotelDetails(hotel: any, hotelId: string) {
    this.currentHotelSubject.next(hotel);
    this.router.navigate(['./', hotelId], { relativeTo: this.route });
    console.log("going to hotel details");
  }
}

class HotelDataSource extends DataSource<any> {
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
