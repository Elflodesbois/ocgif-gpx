import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle-state-button',
  imports: [],
  templateUrl: './toggle-state-button.html',
  styleUrl: './toggle-state-button.scss'
})
export class ToggleStateButton {
    state = input(0);

    symbolOn = input('O');
    symbolOff = input('X');

    turnOn = output<void>();
    turnOff = output<void>();

    toggle() {
        if (this.state() === 0) {
            this.turnOn.emit();
        } else {
            this.turnOff.emit();
        }
    }
}
