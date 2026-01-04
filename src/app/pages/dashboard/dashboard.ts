import { Component } from '@angular/core';
import { ListGpx } from '../../components/list-gpx/list-gpx';
import { GpxDisplay } from '../../gpx-display/gpx-display';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ ListGpx, GpxDisplay],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
