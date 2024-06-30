import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProfileClientInfoComponent } from './client-profile-client-info.component';

describe('ClientProfileClientInfoComponent', () => {
  let component: ClientProfileClientInfoComponent;
  let fixture: ComponentFixture<ClientProfileClientInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientProfileClientInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientProfileClientInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
