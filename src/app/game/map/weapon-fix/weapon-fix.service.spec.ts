import { TestBed } from '@angular/core/testing';

import { WeaponFixService } from './weapon-fix.service';

describe('WeaponFixService', () => {
  let service: WeaponFixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeaponFixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
