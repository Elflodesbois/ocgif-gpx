export interface Difficulte {
  normal: string;         // couleur
  difficile: string;      // couleur
  niveauNormal: string;   // F/N/D/T
  niveauDifficile: string;// F/N/D/T
}

export interface Trace {
  id?: number;
  nom: string;
  description?: string;
  niveau: string;
  distance_km?: number;
  denivele?: number;
  date_parcours?: string;
  cree_le?: string;

  difficulte?: Difficulte; 
}
