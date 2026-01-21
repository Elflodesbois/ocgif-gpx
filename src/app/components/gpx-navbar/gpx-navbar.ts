import { Component, inject } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { NavbarModeSelector } from '../../services/navbar-mode-selector';
import { Auth } from '../../services/auth';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-gpx-navbar',
  imports: [MatButtonToggle, MatButtonToggleGroup, MatIcon, MatButton],
  templateUrl: './gpx-navbar.html',
  styleUrl: './gpx-navbar.scss',
})
export class GpxNavbar {
    mode = inject(NavbarModeSelector);
    logInfo = inject(Auth);

    logout() {
        this.logInfo.logout();
        this.mode.changeMode('login');
    }
}
