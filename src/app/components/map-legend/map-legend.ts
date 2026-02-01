import { Component, inject } from '@angular/core';
import { MapService } from '../../services/map-service';
import { MatIcon } from "@angular/material/icon";
import { MatAnchor, MatIconButton } from "@angular/material/button";

@Component({
  selector: 'app-map-legend',
  imports: [MatIcon, MatIconButton],
  templateUrl: './map-legend.html',
  styleUrl: './map-legend.scss'
})
export class MapLegend {
    mapWrapper = inject(MapService)
}
