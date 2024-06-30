import { Component } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { HotelService } from '../hotel.service';

@Component({
  selector: 'app-dashboard-view-hotel',
  standalone: true,
  imports: [MatInputModule, RouterModule, ClientHeaderComponent, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatListModule, MatTableModule, ReactiveFormsModule, FormsModule, MatSelectModule],
  templateUrl: './dashboard-view-hotel.component.html',
  styleUrl: './dashboard-view-hotel.component.css'
})
export class DashboardViewHotelComponent {
  //currentHotelSubject: BehaviorSubject<any>;
  displayedColumns: string[] = ["Description", "BedOptions", "NumberOfGuest", "Price", "Action"];
  hotel: any;
  rooms: any[] = [];

  dataSource = new UserDataSource(this.rooms);

  constructor(private hotelService: HotelService, private _location: Location) {
    this.hotelService.currentHotel.subscribe(value => this.hotel = value);
    this.rooms = this.hotel.Rooms;
    this.dataSource.setData(this.rooms);
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