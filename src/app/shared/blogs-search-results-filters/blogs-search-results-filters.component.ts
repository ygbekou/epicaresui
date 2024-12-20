import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-blogs-search-results-filters',
  templateUrl: './blogs-search-results-filters.component.html',
  styleUrls: ['./blogs-search-results-filters.component.scss']
})
export class BlogsSearchResultsFiltersComponent implements OnInit {
  @Input() searchFields: any;
  @Output() onRemoveSearchField: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() { }

  public remove(field){
    this.onRemoveSearchField.emit(field);
  }

}