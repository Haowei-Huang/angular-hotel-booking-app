import { Component } from '@angular/core';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { BookingService } from '../booking.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import moment, { Moment } from "moment";
import { BehaviorSubject, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { JsonPipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-client-booking',
  standalone: true,
  imports: [ClientHeaderComponent,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
    MatListModule,
    MatCheckboxModule,
    RouterLink, MatPseudoCheckboxModule, JsonPipe],
  templateUrl: './client-booking.component.html',
  styleUrl: './client-booking.component.css'
})
export class ClientBookingComponent {
  isloggedIn: boolean | null = false;
  role: string | null = '';

  isLinear = true;
  bookingFormGroup: FormGroup;

  private isBookingSuccessSubject = new BehaviorSubject<boolean>(false);
  isBookingSuccessObs = this.isBookingSuccessSubject.asObservable();
  isBookingSuccess: boolean = false;

  userData: any = {};

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private bookingService: BookingService) {
    this.bookingFormGroup = bookingService.bookingFormGroup;

    this.isloggedIn = this.authService.isloggedInSubject.getValue();
    this.role = this.authService.roleSubject.getValue();

    this.authService.isloggedIn.subscribe(isloggedIn => this.isloggedIn = isloggedIn);
    this.authService.role.subscribe(role => this.role = role);
    this.authService.userData.subscribe(value => this.userData = value);
    this.isBookingSuccessObs.subscribe(value => this.isBookingSuccess = value);

    this.reuseInfoGroup.get('reuseClientInfo')?.valueChanges.subscribe(value => {
      if (value === true) {
        this.clientInfoGroup.setValue({ ...this.userData.clientInfo });
      } else {
        this.clientInfoGroup.reset();
      }
    });

    this.reuseInfoGroup.get('reuseCardInfo')?.valueChanges.subscribe(value => {
      if (value === true) {
        this.cardInfoGroup.setValue({ ...this.userData.cardInfo });
      } else {
        this.cardInfoGroup.reset();
      }
    });
  }

  clientInfoGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ,.'-]+$/i)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ,.'-]+$/i)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
  });

  cardInfoGroup = new FormGroup({
    cardName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ,.'-]+$/i)]),
    cardNumber: new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{16})$/)]),
    expDate: new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{4})$/)]),
    cvv: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]),
    address: new FormGroup({
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/)]),
      province: new FormControl('', [Validators.required, Validators.pattern(/^(?:AB|BC|MB|N[BLTSU]|ON|PE|QC|SK|YT){1}$/)]),
      postalCode: new FormControl('', [Validators.required, Validators.pattern(/^([ABCEGHJKLMNPRSTVXY][0-9][A-Z](?: [0-9][A-Z][0-9])?)$/)]),
      country: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\s.-]+$/)]),
    })
  });

  reuseInfoGroup = new FormGroup({
    reuseClientInfo: new FormControl(false),
    reuseCardInfo: new FormControl(false)
  });

  submitClientInfo(stepper: MatStepper) {
    //console.log(this.clientInfoGroup.getRawValue());
    if (this.reuseInfoGroup.controls['reuseClientInfo'].getRawValue() === true) {
      this.clientInfoGroup.setValue({ ...this.userData.clientInfo });
    }
    this.bookingFormGroup.patchValue({ clientInfo: this.clientInfoGroup.getRawValue() });
    stepper.next();
  }

  submitCardInfo(stepper: MatStepper) {
    if (this.reuseInfoGroup.controls['reuseCardInfo'].getRawValue() === true) {
      this.cardInfoGroup.setValue({ ...this.userData.cardInfo });
    } {
      const cardNumber = this.cardInfoGroup.value.cardNumber;
      // card number trim, check if card number is valid
      const trimedCardNumber = cardNumber?.replace(/\s+/g, '');
      const cardNumberRegex = new RegExp(/^[0-9]{16}$/);
      if (trimedCardNumber && !cardNumberRegex.test(trimedCardNumber)) {
        this.cardInfoGroup.controls['cardNumber'].setErrors({ "pattern": "The card number is invalid, it should be 16 digits." });
        return;
      } else {
        this.cardInfoGroup.patchValue({ 'cardNumber': trimedCardNumber });
        this.cardInfoGroup.controls['cardNumber'].setErrors(null);
      }

      // check exp date
      var today = new Date(); // gets the current date
      let today_mm: string | number = today.getMonth() + 1; // extracts the month portion
      var today_yy = (today.getFullYear() % 100); // extracts the year portion and changes it from yyyy to yy format

      if (today_mm < 10) { // if today's month is less than 10
        today_mm = '0' + today_mm // prefix it with a '0' to make it 2 digits
      }

      var today_yymm = today_yy.toString().concat(today_mm.toString());

      const mm: string | undefined = this.cardInfoGroup.value.expDate?.substring(0, 2); // get the mm portion of the expiryDate (first two characters)
      if (Number(mm) <= 0 || Number(mm) > 12) {
        this.cardInfoGroup.controls['expDate'].setErrors({ "custom": "The expiry date is invalid" });
        return;
      }

      const yy: string | undefined = this.cardInfoGroup.value.expDate?.substring(2); // get the yy portion of the expiryDate (from index 2 to end)
      const yymm: string = yy && mm ? yy.concat(mm) : '';

      // check if the card is expired
      if (Number(today_yymm) > Number(yymm)) {
        this.cardInfoGroup.controls['expDate'].setErrors({ "custom": "The card has expried" });
        return;
      }


      //set address values to upper cases
      this.bookingFormGroup.patchValue({
        address: {
          street: this.cardInfoGroup.get('address')?.value.street?.toUpperCase(),
          city: this.cardInfoGroup.get('address')?.value.city?.toUpperCase(),
          province: this.cardInfoGroup.get('address')?.value.province?.toUpperCase(),
          country: this.cardInfoGroup.get('address')?.value.country?.toUpperCase(),
        }
      });
    }

    this.bookingFormGroup.patchValue({ cardInfo: this.cardInfoGroup.getRawValue() });
    //console.log(this.bookingFormGroup.getRawValue());
    stepper.next();
  }

  async confirmBooking(): Promise<void> {
    let bookingData = this.bookingFormGroup.value;
    const roomIdList = bookingData.rooms.map((room: { RoomId: string; }) => room.RoomId);
    const hotelId = bookingData.hotel._id;
    const sessionKey = this.authService.sessionKeySubject.getValue();

    if (sessionKey) {
      bookingData = {
        ...bookingData,
        hotel: hotelId,
        rooms: roomIdList,
        userId: sessionKey,
        time: moment()
      }
    } else {
      bookingData = {
        ...bookingData,
        hotel: hotelId,
        rooms: roomIdList,
        userId: '',
        time: moment()
      }
    }

    //console.log(bookingData);
    if (bookingData) {
      if (await this.bookingService.createBooking(bookingData)) {
        this.isBookingSuccessSubject.next(true);
      } else {
        console.error("Failed during creating booking");
        this.isBookingSuccessSubject.next(false);
      }
    } else {
      console.error("Booking data not valid");
      this.isBookingSuccessSubject.next(false);
    }
  }

  get hotel() {
    return this.bookingFormGroup.value.hotel;
  }

  get totalPrice() {
    return this.bookingFormGroup.value.totalPrice;
  }

  get from() {
    return this.bookingFormGroup.value.from;
  }

  formatDate(moment: Moment) {
    return moment.format('MMMM d, yyyy');
  }

  get to() {
    return this.bookingFormGroup.value.to;
  }

  get duration() {
    return this.bookingFormGroup.value.duration;
  }

  get rooms() {
    return this.bookingFormGroup.value.rooms;
  }

  get numberOfGuest() {
    return this.bookingFormGroup.value.numberOfGuest;
  }
}
