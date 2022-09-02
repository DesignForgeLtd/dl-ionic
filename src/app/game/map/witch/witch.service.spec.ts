import { TestBed } from '@angular/core/testing';

import { WitchService } from './witch.service';

describe('WitchService', () => {
  let service: WitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
