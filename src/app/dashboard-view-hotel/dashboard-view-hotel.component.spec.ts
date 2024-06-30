import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardViewHotelComponent } from './dashboard-view-hotel.component';

describe('DashboardViewHotelComponent', () => {
  let component: DashboardViewHotelComponent;
  let fixture: ComponentFixture<DashboardViewHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardViewHotelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardViewHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
