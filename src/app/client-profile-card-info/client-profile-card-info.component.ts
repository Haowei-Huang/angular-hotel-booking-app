import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client-profile-card-info',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatError],
  templateUrl: './client-profile-card-info.component.html',
  styleUrl: './client-profile-card-info.component.css'
})
export class ClientProfileCardInfoComponent {
  userProfile: any = {};
  userId: any = '';

  constructor(private userSerivce: UserService, private authService: AuthService, private _snackBar: MatSnackBar) {
    this.userId = authService.sessionKeySubject.getValue();
  }

  async ngOnInit(): Promise<any> {
    this.userProfile = await this.userSerivce.findById(this.userId);
    this.cardInfoGroup.setValue({ ...this.userProfile.cardInfo });
  }

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

  durationInSeconds = 5;
  openSnackBar() {
    this._snackBar.openFromComponent(CardInfoChangeSnackBarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  async submitCardInfo(): Promise<any> {
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
    this.cardInfoGroup.patchValue({
      address: {
        street: this.cardInfoGroup.get('address')?.value.street?.toUpperCase(),
        city: this.cardInfoGroup.get('address')?.value.city?.toUpperCase(),
        province: this.cardInfoGroup.get('address')?.value.province?.toUpperCase(),
        country: this.cardInfoGroup.get('address')?.value.country?.toUpperCase(),
      }
    });

    //console.log(this.cardInfoGroup.getRawValue());

    const newUserInfo = { ...this.userProfile, cardInfo: { ...this.cardInfoGroup.getRawValue() } };
    if (await this.userSerivce.updateUser(newUserInfo)) {
      this.openSnackBar();
      this.userProfile = await this.userSerivce.findById(this.userId);
      this.cardInfoGroup.setValue({ ...this.userProfile.cardInfo });
    }
  }
}

@Component({
  selector: 'snack-bar-cardInfo-change',
  templateUrl: 'snack-bar-cardInfo-change.html',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
})
export class CardInfoChangeSnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
}
