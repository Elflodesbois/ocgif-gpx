import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpxService } from '../../services/gpx.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-upload-gpx',
  imports: [FormsModule,CommonModule],
  standalone: true,
  templateUrl: './upload-gpx.html',
  styleUrls: ['./upload-gpx.scss']
})
export class UploadGpx {
  
  name = '';
  description = '';
  file!: File;  // contiendra le fichier GPX sélectionné

  message = '';  // message de retour

  constructor(private gpxService: GpxService) {}

  // Quand l'utilisateur choisit un fichier
  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  // Upload du GPX
  upload() {
    if (!this.name || !this.file) {
      this.message = 'Nom et fichier obligatoires';
      return;
    }

    this.gpxService.uploadGPX(this.name, this.description, this.file)
      .subscribe({
        next: (res) => {
          console.log('Upload réussi', res);
          this.message = 'GPX uploadé avec succès !';
        },
        error: (err) => {
          console.error(err);
          this.message = 'Erreur lors de l\'upload';
        }
      });
  }

}
