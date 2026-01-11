import { TestBed } from '@angular/core/testing';

import { Difficulty } from './difficulty';

describe('Difficulty', () => {
  let service: Difficulty;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Difficulty);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
