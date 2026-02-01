import { Component, AfterViewInit, Input } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import GPX from 'ol/format/GPX';
import { defaults as interactionDefaults } from 'ol/interaction/defaults';
import { defaults as controlDefaults } from 'ol/control/defaults';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import { getCenter } from 'ol/extent';

@Component({
  selector: 'app-gpx-preview-map',
  standalone: true,
  templateUrl: './gpx-preview-map.html',
  styleUrl: './gpx-preview-map.scss'
})
export class GpxPreviewMap implements AfterViewInit {

  @Input({ required: true }) traceId!: number;

  private map!: Map;

  ngAfterViewInit(): void {

    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        const type = feature.getGeometry()?.getType();
        if (type === 'LineString' || type === 'MultiLineString') {
          return new Style({
            stroke: new Stroke({
              color: '#ff0000',
              width: 3
            })
          });
        } else if (type === 'Point') {
          return new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({ color: 'yellow' }),
              stroke: new Stroke({ color: '#ff0', width: 1 })
            })
          });
        }
        return undefined;
      }
    });

    this.map = new Map({
      target: `preview-map-${this.traceId}`,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer
      ],
      interactions: interactionDefaults({
        dragPan: false,
        mouseWheelZoom: false,
        doubleClickZoom: false,
        pinchZoom: false,
        keyboard: false
      }),
      controls: controlDefaults({ zoom: false, rotate: false }),
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    // Charger le GPX
    fetch(`http://localhost:3000/api/gpx/download/${this.traceId}`)
      .then(res => res.text())
      .then(gpxText => {
        const format = new GPX();
        const features = format.readFeatures(gpxText, {
          featureProjection: 'EPSG:3857',
          dataProjection: 'EPSG:4326'
        });

        if (!features || features.length === 0) {
          console.warn(`Aucune feature chargée pour trace ${this.traceId}`);
          return;
        }

        vectorSource.addFeatures(features);

        // 🔹 Centrer et ajuster automatiquement pour voir toute la trace
        const extent = vectorSource.getExtent();
        if (extent) {
          this.map.getView().fit(extent, {
            padding: [20, 20, 20, 20], // petit padding autour de la trace
            maxZoom: 16,               // limite le zoom pour pas trop zoomer
            duration: 300               // animation smooth
          });
        }
      })
      .catch(err => console.error('Erreur chargement GPX:', err));
  }
}
