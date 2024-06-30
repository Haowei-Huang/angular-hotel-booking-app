import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProfileCardInfoComponent } from './client-profile-card-info.component';

describe('ClientProfileCardInfoComponent', () => {
  let component: ClientProfileCardInfoComponent;
  let fixture: ComponentFixture<ClientProfileCardInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientProfileCardInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientProfileCardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
