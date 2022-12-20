import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DataTableComponent } from './data-table/data-table.component';
import { FreiraumMapComponent } from './freiraum-map/freiraum-map.component';

const routes: Routes = [
  { path: '', component: FreiraumMapComponent },
  { path: 'about', component: AboutComponent },
  { path: 'table', component: DataTableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
