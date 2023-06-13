import { TestBed } from '@angular/core/testing';

import { WeaponEnhanceService } from './weapon-enhance.service';

describe('WeaponEnhanceService', () => {
  let service: WeaponEnhanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeaponEnhanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
