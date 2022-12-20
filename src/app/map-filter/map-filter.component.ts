import {
  Component,
  Input,
  ViewChild,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  AfterViewInit,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ByOwnerDataAggregation } from '../model/api';
import {
  CdkVirtualScrollViewport,
  ScrollDispatcher,
} from '@angular/cdk/scrolling';
import { MatOption, MatOptionSelectionChange } from '@angular/material/core';
import { filter } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss'],
})
export class MapFilterComponent implements AfterViewInit, OnChanges {
  @Input() byOwnerData: ByOwnerDataAggregation[] = [];
  byOwnerDataFiltered: ByOwnerDataAggregation[] = [];
  multiSelectControl = new FormControl('');
  searchFormControl = new FormControl('');
  searchText = '';
  selected: ByOwnerDataAggregation[] = [];
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  cdkVirtualScrollViewPort: CdkVirtualScrollViewport | undefined;
  @ViewChildren(MatOption)
  options: QueryList<MatOption> = new QueryList();
  selectedTexts: string[] = [];
  @Output() selectedByOwner = new EventEmitter<ByOwnerDataAggregation[]>();
  @Output() showSquats = new EventEmitter<boolean>();

  constructor(private cd: ChangeDetectorRef, readonly sd: ScrollDispatcher) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['byOwnerData'].currentValue?.length > 0) {
      this.byOwnerDataFiltered = this.byOwnerData;
      this.selected = [...this.byOwnerData].splice(0, 3);
      this.selectedByOwner.emit(this.selected);
      this.displaySelectedTexts();
    }
  }

  ngAfterViewInit(): void {
    this.sd
      .scrolled()
      .pipe(filter(scrollable => this.cdkVirtualScrollViewPort === scrollable))
      .subscribe(() => {
        let needUpdate = false;

        this.options.forEach(option => {
          const selected = this.selected.includes(option.value);

          if (selected && !option.selected) {
            option.select();
            needUpdate = true;
          } else if (!selected && option.selected) {
            option.deselect();
            needUpdate = true;
          }
        });

        if (needUpdate) {
          this.cd.detectChanges();
        }
      });

    this.searchFormControl.valueChanges.subscribe(searchText => {
      if (!searchText) {
        this.byOwnerDataFiltered = this.byOwnerData;
      }

      const filtered = this.byOwnerData.filter(entry => {
        return entry?.owner
          ?.toLowerCase()
          ?.includes(searchText?.toLowerCase() || '');
      });
      this.byOwnerDataFiltered = filtered;
    });
  }

  displaySelectedTexts() {
    this.selectedTexts = this.selected.map(
      ownerSet => ownerSet.owner + ' (' + ownerSet.egrids.length + ')'
    );
  }

  foropen() {
    this.cdkVirtualScrollViewPort?.scrollToIndex(5);
  }

  clear() {
    this.selected = [];
    this.multiSelectControl.patchValue(null);
    this.selectedByOwner.emit([]);
  }

  openChange($event: boolean) {
    if ($event) {
      this.foropen();
      this.cdkVirtualScrollViewPort?.scrollToIndex(0);
      this.cdkVirtualScrollViewPort?.checkViewportSize();
      this.displaySelectedTexts();
    }
  }

  onSelectionChange(change: MatOptionSelectionChange): void {
    if (!change.isUserInput) {
      return;
    }
    const value = change.source.value;
    const idx = this.selected.indexOf(change.source.value);

    if (idx > -1) {
      this.selected.splice(idx, 1);
    } else {
      this.selected.push(value);
    }
    this.displaySelectedTexts();
    this.selectedByOwner.emit(this.selected);
  }

  toggleSquats(event: MatCheckboxChange) {
    this.showSquats.emit(event.checked);
  }
}
