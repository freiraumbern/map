import { Component, ViewChild } from '@angular/core';
import {
  DatatableComponent as DTComp,
  ColumnMode,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { Egrid } from '../model/api';
import { values } from 'lodash';
import { HttpService } from '../http.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent {
  rows: Egrid[] = [];

  columns = [
    { prop: 'egrid' },
    { prop: 'owners' },
    { prop: 'address' },
    { prop: 'type' },
    { prop: 'subs' },
  ];

  temp: Egrid[] = [];

  @ViewChild(DTComp) table: DTComp;

  ColumnMode = ColumnMode;

  SelectionType = SelectionType;

  searchFormControl: FormControl = new FormControl('');

  isFiltering = false;

  constructor(private httpService: HttpService) {
    this.httpService.getData().subscribe(data => {
      // cache our list
      this.temp = values(data);

      // push our inital complete list
      this.rows = values(data);
    });
    this.searchFormControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(searchText => {
        this.isFiltering = true;
        this.updateFilter(searchText?.toLowerCase());
        this.isFiltering = false;
      });
  }

  updateFilter(searchText: string) {
    const temp = this.temp.filter(function (entry) {
      return (
        JSON.stringify(entry).toLowerCase().indexOf(searchText) !== -1 ||
        !searchText
      );
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  onRowClicked(event: Event) {
    console.log(event);
  }
}
