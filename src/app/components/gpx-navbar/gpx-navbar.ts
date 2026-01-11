import { Component, inject } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { NavbarModeSelector } from '../../services/navbar-mode-selector';

@Component({
  selector: 'app-gpx-navbar',
  imports: [MatButtonToggle, MatButtonToggleGroup, MatIcon],
  templateUrl: './gpx-navbar.html',
  styleUrl: './gpx-navbar.scss',
})
export class GpxNavbar {
    mode = inject(NavbarModeSelector);
}
