import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardViewBookingComponent } from './dashboard-view-booking.component';

describe('DashboardViewBookingComponent', () => {
  let component: DashboardViewBookingComponent;
  let fixture: ComponentFixture<DashboardViewBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardViewBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardViewBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
