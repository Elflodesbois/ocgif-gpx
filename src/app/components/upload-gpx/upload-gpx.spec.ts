import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadGpx } from './upload-gpx';

describe('UploadGpx', () => {
  let component: UploadGpx;
  let fixture: ComponentFixture<UploadGpx>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadGpx]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadGpx);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
