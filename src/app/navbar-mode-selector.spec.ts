import { TestBed } from '@angular/core/testing';

import { NavbarModeSelector } from './navbar-mode-selector';

describe('NavbarModeSelector', () => {
  let service: NavbarModeSelector;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarModeSelector);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
