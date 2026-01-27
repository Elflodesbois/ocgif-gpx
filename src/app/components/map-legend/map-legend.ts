import { Component, inject } from '@angular/core';
import { MapService } from '../../services/map-service';

@Component({
  selector: 'app-map-legend',
  imports: [],
  templateUrl: './map-legend.html',
  styleUrl: './map-legend.scss'
})
export class MapLegend {
    mapWrapper = inject(MapService)
}
