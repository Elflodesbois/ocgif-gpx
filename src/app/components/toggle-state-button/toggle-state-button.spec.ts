import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleStateButton } from './toggle-state-button';

describe('ToggleStateButton', () => {
  let component: ToggleStateButton;
  let fixture: ComponentFixture<ToggleStateButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleStateButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleStateButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
