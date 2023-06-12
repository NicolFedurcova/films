import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendecUsersComponent } from './extendec-users.component';

describe('ExtendecUsersComponent', () => {
  let component: ExtendecUsersComponent;
  let fixture: ComponentFixture<ExtendecUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendecUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendecUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
