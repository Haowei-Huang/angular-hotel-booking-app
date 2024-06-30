import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardManageHotelsComponent } from './dashboard-manage-hotels.component';

describe('DashboardManageHotelsComponent', () => {
  let component: DashboardManageHotelsComponent;
  let fixture: ComponentFixture<DashboardManageHotelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardManageHotelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardManageHotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
