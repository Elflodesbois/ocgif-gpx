import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutGpx } from './ajout-gpx';

describe('AjoutGpx', () => {
  let component: AjoutGpx;
  let fixture: ComponentFixture<AjoutGpx>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutGpx]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutGpx);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
