import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientViewBookingsComponent } from './client-view-bookings.component';

describe('ClientViewBookingsComponent', () => {
  let component: ClientViewBookingsComponent;
  let fixture: ComponentFixture<ClientViewBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientViewBookingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientViewBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
