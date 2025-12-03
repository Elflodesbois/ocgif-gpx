import { TestBed } from '@angular/core/testing';

import { Gpx } from './gpx';

describe('Gpx', () => {
  let service: Gpx;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Gpx);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
