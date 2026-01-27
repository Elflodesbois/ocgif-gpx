import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpxService } from '../../services/gpx.service';
import { CommonModule } from '@angular/common';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormField, MatLabel, MatHint, MatSuffix, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-upload-gpx',
  standalone: true,
  templateUrl: './upload-gpx.html',
  styleUrls: ['./upload-gpx.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatIcon,
    MatSelect,
    MatDatepickerModule,
    MatNativeDateModule,
    MatLabel,
    MatOption,
    MatHint,
    MatSuffix
],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    }
  ]
})
export class UploadGpx {

  
  nom = '';
  description = '';
  niveau = '';
  distance_km!: number;
  denivele!: number;
  date_parcours!: Date | null;
  fichier!: File;  // contiendra le fichier GPX sélectionné

  message = '';  // message de retour

  niveaux = [
    'groupe balade',
    'groupe 1',
    'groupe 2',
    'groupe 3',
    'groupe 4',
    'groupe 5',
    'groupe sportif',
    'groupe école',
    'groupe evo',
    'groupe perf'
  ];

  constructor(private gpxService: GpxService) {}

  // Quand l'utilisateur choisit un fichier
  onFileSelected(event: any) {
    this.fichier = event.target.files[0];
    if (this.fichier) {
      this.analyserGPX(this.fichier);
    }
  }
analyserGPX(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(e.target.result, 'application/xml');
      const trkpts = xml.getElementsByTagName('trkpt');

      let totalDistance = 0;
      let deniveleTotal = 0;
      let prevLat: number | null = null;
      let prevLon: number | null = null;
      let prevEle: number | null = null;

      for (let i = 0; i < trkpts.length; i++) {
        const lat = parseFloat(trkpts[i].getAttribute('lat')!);
        const lon = parseFloat(trkpts[i].getAttribute('lon')!);
        const ele = parseFloat(trkpts[i].getElementsByTagName('ele')[0]?.textContent || '0');

        if (prevLat !== null) {
          const R = 6371;
          const dLat = (lat - prevLat) * Math.PI / 180;
          const dLon = (lon - prevLon!) * Math.PI / 180;
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(prevLat * Math.PI / 180) *
            Math.cos(lat * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          totalDistance += R * c;

          const diffEle = ele - prevEle!;
          if (diffEle > 0) deniveleTotal += diffEle;
        }

        prevLat = lat;
        prevLon = lon;
        prevEle = ele;
      }

      this.distance_km = +totalDistance.toFixed(2);
      this.denivele = Math.round(deniveleTotal);

      const timeTag = xml.getElementsByTagName('time')[0];
      if (timeTag) {
        console.log(new Date(Date.parse(timeTag.textContent!.split('T')[0])));
        this.date_parcours = new Date(Date.parse(timeTag.textContent!.split('T')[0]));
      }
    };
    reader.readAsText(file);
  }

  envoyer() {
    if (!this.nom || !this.description || !this.niveau || !this.fichier) {
      this.message = 'Champs obligatoires manquants';
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.nom);
    formData.append('description', this.description);
    formData.append('niveau', this.niveau);
    formData.append('distance_km', this.distance_km.toString());
    formData.append('denivele', this.denivele.toString());
    formData.append('date_parcours', (this.date_parcours? this.date_parcours.toString() : ':'));
    formData.append('file', this.fichier);

    this.gpxService.uploadTrace(formData).subscribe({
     next: () => {
      this.message = 'Trace ajoutée avec succès !';
      this.resetForm();

      // optionnel : faire disparaître le message après 10 secondes
      setTimeout(() => {
        this.message = '';
      }, 10000);
    },
      error: () => this.message = 'Erreur lors de l\'envoi'
    });
  }

  resetForm() {
    this.nom = '';
    this.description = '';
    this.niveau = '';
    this.distance_km = undefined!;
    this.denivele = undefined!;
    this.date_parcours = null;
    this.fichier = undefined!;
  }


}
