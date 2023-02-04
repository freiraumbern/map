import { Component, Inject } from '@angular/core';
import { ColonialLocation } from '../model/api';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-colonial-dialog',
  templateUrl: './colonial-dialog.component.html',
  styleUrls: ['./colonial-dialog.component.scss'],
})
export class ColonialDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ColonialLocation,
    private domSanitizer: DomSanitizer
  ) {}

  getImage(imgHtml: string): any {
    return this.domSanitizer.bypassSecurityTrustHtml(imgHtml);
  }
}
