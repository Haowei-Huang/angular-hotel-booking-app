import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardManageBookingsComponent } from './dashboard-manage-bookings.component';

describe('DashboardManageBookingsComponent', () => {
  let component: DashboardManageBookingsComponent;
  let fixture: ComponentFixture<DashboardManageBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardManageBookingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardManageBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
