import { Component, inject } from '@angular/core';
import { GpxMap } from "../gpx-map/gpx-map";
import { GpxNavbar } from "../gpx-navbar/gpx-navbar";
import { NavbarModeSelector } from '../navbar-mode-selector';

@Component({
  selector: 'app-gpx-display',
  imports: [GpxMap, GpxNavbar],
  templateUrl: './gpx-display.html',
  styleUrl: './gpx-display.scss'
})
export class GpxDisplay {
    mode = inject(NavbarModeSelector);
}
