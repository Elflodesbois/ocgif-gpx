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
    n = 0;

    addgrandtour() {
        const layer = this.mapWrapper.vectorizeGpxFile('grand_tour.gpx');
        this.mapWrapper.addLayer('name'+this.n++, layer);
    }

    rmgrandtour(name: string) {
        this.mapWrapper.removeLayer(name);
    }
}
