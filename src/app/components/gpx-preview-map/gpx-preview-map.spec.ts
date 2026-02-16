import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpxPreviewMap } from './gpx-preview-map';

describe('GpxPreviewMap', () => {
  let component: GpxPreviewMap;
  let fixture: ComponentFixture<GpxPreviewMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpxPreviewMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpxPreviewMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
