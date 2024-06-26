import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DataTableComponent } from './data-table/data-table.component';
import { FreiraumMapComponent } from './freiraum-map/freiraum-map.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { QrGeneratorComponent } from './qr-generator/qr-generator.component';

const routes: Routes = [
  { path: '', component: FreiraumMapComponent },
  { path: 'about', component: AboutComponent },
  { path: 'table', component: DataTableComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'qr', component: QrGeneratorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
