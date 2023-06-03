import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Egrid } from '../model/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { QRService } from '../qr.service';

@Component({
  selector: 'app-egrid-dialog',
  templateUrl: './egrid-dialog.component.html',
  styleUrls: ['./egrid-dialog.component.scss'],
})
export class EgridDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Egrid,
    private domSanitizer: DomSanitizer,
    private qrService: QRService
  ) {}

  getGoogleMapUrl(adresses: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${
        adresses.split('|')[0]
      }&output=embed&t=h&z=20`
    );
  }

  addToQRGenerator(): void {
    this.qrService.addEgrid(this.data);
  }
}
