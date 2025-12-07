import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-toggle-state-button',
  imports: [],
  templateUrl: './toggle-state-button.html',
  styleUrl: './toggle-state-button.scss'
})
export class ToggleStateButton {
    stateTracker = signal(0);

    symbolOn = input('O');
    symbolOff = input('X');

    turnOn = output<void>();
    turnOff = output<void>();

    toggle() {
        if (this.stateTracker()) {
            this.stateTracker.set(0);
            this.turnOn.emit();
        } else {
            this.stateTracker.set(1);
            this.turnOff.emit();
        }
    }
}
