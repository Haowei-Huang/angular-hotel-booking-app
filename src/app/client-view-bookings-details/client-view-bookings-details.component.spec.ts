import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientViewBookingsDetailsComponent } from './client-view-bookings-details.component';

describe('ClientViewBookingsDetailsComponent', () => {
  let component: ClientViewBookingsDetailsComponent;
  let fixture: ComponentFixture<ClientViewBookingsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientViewBookingsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientViewBookingsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
