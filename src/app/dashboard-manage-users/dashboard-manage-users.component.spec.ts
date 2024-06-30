import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardManageUsersComponent } from './dashboard-manage-users.component';

describe('DashboardManageUsersComponent', () => {
  let component: DashboardManageUsersComponent;
  let fixture: ComponentFixture<DashboardManageUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardManageUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardManageUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
