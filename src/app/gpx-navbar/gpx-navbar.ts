import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { NavbarModeSelector } from '../navbar-mode-selector';

@Component({
  selector: 'app-gpx-navbar',
  imports: [MatButtonToggle, MatButtonToggleGroup, MatIcon, MatButton],
  templateUrl: './gpx-navbar.html',
  styleUrl: './gpx-navbar.scss',
})
export class GpxNavbar {
    mode = inject(NavbarModeSelector);
}
