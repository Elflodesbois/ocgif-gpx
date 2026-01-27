import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesTraces } from './mes-traces';

describe('MesTraces', () => {
  let component: MesTraces;
  let fixture: ComponentFixture<MesTraces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesTraces]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesTraces);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
