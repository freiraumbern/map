import { Component } from '@angular/core';
import { QRService } from '../qr.service';
import { Egrid } from '../model/api';
import * as QC from 'qrcode';
import {jsPDF} from 'jspdf'

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.scss'],
})
export class QrGeneratorComponent {
  data: Egrid[] = [];

  constructor(private qrService: QRService) {
    this.loadData();
  }

  loadData() {
    this.data = Object.values(this.qrService.getQRData());
  }

  remove(egrid: string) {
    console.log('sadfdsf', egrid);
    this.qrService.removeEgrid(egrid);
    this.loadData();
  }

  async print() {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [297, 210],
    });
    let heightTracker = 10;
    let itemCOunter = 0;
    let pageCounter = 1;
    for (const egrid of this.data) {
      const qrcodeDataUrl= await QC.toDataURL("https://unlock-the.city?egrid=" + egrid.ownership.egrid)
      pdf.setFontSize(15);
      pdf.text(egrid.ownership.owners.join(", "), 43, heightTracker)
      pdf.setFontSize(10);
      pdf.text(egrid.ownership.address, 43, heightTracker + 5);
      pdf.text("Wem gehört die Stadt? Wer darf sich frei darin bewegen? Kampagne zur Raumfrage mit Vorträgen, Aktionen und Onlinekarte",43,  heightTracker + 10)
      pdf.text("https://unlock-the.city", 43, heightTracker + 20);
      pdf.addImage(qrcodeDataUrl, 'png', 0, heightTracker -8, 40, 40);

      heightTracker += 40;
      itemCOunter +=1

      if (itemCOunter % 5 === 0) {
        pdf.addPage()
        pageCounter += 1;
        heightTracker = 10;
        pdf.setPage(pageCounter)
      }
    }
   

   
    pdf.save('generated.pdf');
  }
}
