import { Component } from '@angular/core';
import { UploadGpx } from '../../components/upload-gpx/upload-gpx';

@Component({
  selector: 'app-ajout-gpx',
  standalone: true,
  imports: [UploadGpx],
  templateUrl: './ajout-gpx.html',
  styleUrl: './ajout-gpx.scss'
})
export class AjoutGpx {

}

