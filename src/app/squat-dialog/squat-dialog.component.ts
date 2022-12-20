import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Squat } from '../model/api';

@Component({
  selector: 'app-squat-dialog',
  templateUrl: './squat-dialog.component.html',
  styleUrls: ['./squat-dialog.component.scss'],
})
export class SquatDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Squat) {}
}
