import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SextonSidebarContentComponent } from './sexton-sidebar-content.component';

describe('SextonSidebarContentComponent', () => {
  let component: SextonSidebarContentComponent;
  let fixture: ComponentFixture<SextonSidebarContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SextonSidebarContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SextonSidebarContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
