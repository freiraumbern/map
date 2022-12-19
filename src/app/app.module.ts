import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GrundlosMapComponent } from './grundlos-map/grundlos-map.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AboutComponent } from './about/about.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpService } from './http.service';
import { MapFilterComponent } from './map-filter/map-filter.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MapCaptionAreaComponent } from './map-caption-area/map-caption-area.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EgridDialogComponent } from './egrid-dialog/egrid-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { DataTableComponent } from './data-table/data-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgHttpCachingModule } from 'ng-http-caching';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    GrundlosMapComponent,
    AboutComponent,
    MapFilterComponent,
    MapCaptionAreaComponent,
    EgridDialogComponent,
    DataTableComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    LeafletModule,
    MatExpansionModule,
    MatSelectModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatCardModule,
    MatChipsModule,
    NgxMatSelectSearchModule,
    MatDialogModule,
    NgHttpLoaderModule.forRoot(),
    NgxDatatableModule,
    MatFormFieldModule,
    MatInputModule,
    NgHttpCachingModule,
  ],
  providers: [
    HttpService,
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
