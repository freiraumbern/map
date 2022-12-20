import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Squat } from '../model/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-squat-dialog',
  templateUrl: './squat-dialog.component.html',
  styleUrls: ['./squat-dialog.component.scss'],
})
export class SquatDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Squat,
    private domSanitizer: DomSanitizer
  ) {}

  getGoogleMapUrl(query: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${query}&output=embed&t=h&z=20`
    );
  }
}
