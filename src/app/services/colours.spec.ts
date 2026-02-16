import { TestBed } from '@angular/core/testing';

import { Colours } from './colours';

describe('Colours', () => {
  let service: Colours;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Colours);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
