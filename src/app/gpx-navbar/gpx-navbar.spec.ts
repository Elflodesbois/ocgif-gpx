import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpxNavbar } from './gpx-navbar';

describe('GpxNavbar', () => {
  let component: GpxNavbar;
  let fixture: ComponentFixture<GpxNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpxNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpxNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
