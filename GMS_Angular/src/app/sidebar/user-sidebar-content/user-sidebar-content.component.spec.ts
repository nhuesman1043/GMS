import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSidebarContentComponent } from './user-sidebar-content.component';

describe('UserSidebarContentComponent', () => {
  let component: UserSidebarContentComponent;
  let fixture: ComponentFixture<UserSidebarContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSidebarContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserSidebarContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
