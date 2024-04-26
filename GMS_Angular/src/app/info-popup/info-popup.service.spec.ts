import { TestBed } from '@angular/core/testing';

import { InfoPopupService } from './info-popup.service';

describe('InfoPopupService', () => {
  let service: InfoPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
