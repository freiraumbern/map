import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent {
  rent: null;
  district: null;
  rooms: null;
  // https://www.bern.ch/themen/stadt-recht-und-politik/bern-in-zahlen/katost/05pre/mietpreise/t-05-03-050i.pdf/download
  data = {
    'Innere Stadt': {
      1: 928,
      2: 1274,
      3: 1692,
      4: 2148,
      5: 2656,
    },
    'Länggasse-Felsenau': {
      1: 745,
      2: 1120,
      3: 1311,
      4: 1756,
      5: 2085,
    },
    'Mattenhof-Weissenbühl': {
      1: 741,
      2: 1026,
      3: 1301,
      4: 1659,
      5: 1882,
    },
    'Kirchenfeld-Schlosshalde': {
      1: 681,
      2: 1119,
      3: 1303,
      4: 1693,
      5: 2135,
    },
    'Breitenrain-Lorraine': {
      1: 733,
      2: 1051,
      3: 1320,
      4: 1696,
      5: 2103,
    },
    'Bümpliz-Oberbottigen': {
      1: 695,
      2: 892,
      3: 1025,
      4: 1247,
      5: 1580,
    },
  };

  getMedianRent(): number | null {
    if (this.district && this.rooms) {
      return this.data[this.district][this.rooms];
    }
    return null;
  }

  paysTooMuch(): boolean {
    const medianRent = this.getMedianRent();
    if (medianRent && this.rent) {
      return medianRent < this.rent;
    }
    return false;
  }
}
