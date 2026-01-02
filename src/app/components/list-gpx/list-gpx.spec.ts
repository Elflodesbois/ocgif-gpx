import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGpx } from './list-gpx';

describe('ListGpx', () => {
  let component: ListGpx;
  let fixture: ComponentFixture<ListGpx>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGpx]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGpx);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
