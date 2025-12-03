import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpxDisplay } from './gpx-display';

describe('GpxDisplay', () => {
  let component: GpxDisplay;
  let fixture: ComponentFixture<GpxDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpxDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpxDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
