export interface Location {
  centroid: {
    x: number;
    y: number;
  };
  extent: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

export interface Ownership {
  egrid: string;
  owners: string[];
  type: string;
  address: string;
  subEgrids: string[];
  hasErbengemeinschaftEntries: boolean;
}

export interface Egrid {
  location: Location;
  ownership: Ownership;
}

export interface DataResponse {
  [key: string]: Egrid;
}

export interface ByOwnerDataAggregation {
  egrids: string[];
  owner: string;
}

export interface Squat {
  street: string;
  plz: string;
  date: string;
  lat: string;
  long: string;
  notes: string;
  title: string;
  img: string;
  category: string;
}

export interface Femicide {
  date: string;
  lat: string;
  long: string;
  notes: string;
}
