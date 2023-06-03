import { Injectable } from '@angular/core';
import { Egrid, DataResponse } from './model/api';

@Injectable({
  providedIn: 'root',
})
export class QRService {
  addEgrid(egrid: Egrid) {
    const current = this.getQRData();
    if (!current[egrid.ownership.egrid]) {
      current[egrid.ownership.egrid] = egrid;
    }
    this.setQRData(current);
  }

  removeEgrid(egrid: string) {
    const current = this.getQRData();
    delete current[egrid];
    this.setQRData(current);
  }

  getQRData() {
    return JSON.parse(localStorage.getItem('qr_data') || '{}');
  }

  setQRData(data: DataResponse) {
    localStorage.setItem('qr_data', JSON.stringify(data));
  }
}
