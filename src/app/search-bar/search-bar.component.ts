import { JsonPipe } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateRange, MatDateRangeSelectionStrategy, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter, provideMomentDateAdapter } from '@angular/material-moment-adapter';
import moment, { Moment } from "moment";
import { Router, RouterModule } from '@angular/router';
import { HotelService } from '../hotel.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  providers: [provideMomentDateAdapter()],
  imports: [MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    JsonPipe,
    MatDatepickerModule,
    RouterModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})

export class SearchBarComponent {
  searchFormGroup: FormGroup;
  today: Moment | any;
  minDate: Moment | any;

  constructor(private hotelService: HotelService) {
    this.searchFormGroup = hotelService.searchFormGroup;
    this.today = moment();
    this.hotelService.today.subscribe(today => this.today = today);
    this.hotelService.minDate.subscribe(minDate => this.minDate = minDate);
  }
}