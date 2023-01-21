import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  NgHttpLoaderComponent,
  Spinkit,
  SpinnerVisibilityService,
} from 'ng-http-loader';
import { MatDialog } from '@angular/material/dialog';
import { WelcomeComponent } from './welcome/welcome.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SpinnerVisibilityService],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('ngHttpLoader')
  ngHttpLoader!: NgHttpLoaderComponent;

  spinkit = Spinkit;

  welcomed = false;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private spinnerService: SpinnerVisibilityService
  ) {}

  ngAfterViewInit(): void {
    this.ngHttpLoader.isVisible$.subscribe(v => {
      if (!v && !this.welcomed) {
        this.dialog.open(WelcomeComponent, {
          width: '100vw',
          height: '50vh',
        });
        this.welcomed = true;
        console.log('No HTTP requests pending anymore (from ngAfterViewInit)');
      }
    });
  }
}
