export interface Trace {
  nom: string;
  description?: string;
  niveau: string;
  distance_km?: number;
  denivele?: number;
  date_parcours?: string;
  fichier_gpx: File;
}
