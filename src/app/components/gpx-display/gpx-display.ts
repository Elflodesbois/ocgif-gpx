import { Component, inject } from '@angular/core';
import { GpxMap } from "../gpx-map/gpx-map";
import { GpxNavbar } from "../gpx-navbar/gpx-navbar";
import { NavbarModeSelector } from '../../services/navbar-mode-selector';
import { Login } from '../login/login';
import { ListGpx } from "../list-gpx/list-gpx";
import { UploadGpx } from "../upload-gpx/upload-gpx";
import { Register } from "../register/register";
import { MesTraces } from "../mes-traces/mes-traces";

@Component({
  selector: 'app-gpx-display',
  imports: [GpxMap, GpxNavbar, Login, ListGpx, UploadGpx, Register, MesTraces],
  templateUrl: './gpx-display.html',
  styleUrl: './gpx-display.scss'
})
export class GpxDisplay {
    mode = inject(NavbarModeSelector);
}
