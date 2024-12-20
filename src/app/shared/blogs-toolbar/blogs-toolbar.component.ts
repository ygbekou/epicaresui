import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-blogs-toolbar',
  templateUrl: './blogs-toolbar.component.html',
  styleUrls: ['./blogs-toolbar.component.scss']
})
export class BlogsToolbarComponent implements OnInit {
  @Input() isHomePage: boolean = false;
  @Input() showSidenavToggle: boolean = false;
  @Output() onSidenavToggle: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChangeCount: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChangeSorting: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChangeViewType: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSearchClick: EventEmitter<any> = new EventEmitter<any>();

  public viewType: string = 'grid';
  public viewCol: number = 25;
  public counts = [8, 12, 16, 24, 36];
  public count: any;
  lang = 'fr';
  public sortings = [
    { code: 'publicationAsc', name: 'Plus recents' },
    { code: 'publicationDesc', name: 'Plus anciens' },
    { code: 'vews', name: 'Vues' },
    { code: 'rating', name: 'Rating' }];
  public sort: any;
  public searchForm: FormGroup;
  constructor(public fb: FormBuilder, public translate: TranslateService) { }

  ngOnInit() {
    let lang = navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    if (Cookie.get('lang')) {
      lang = Cookie.get('lang');
      console.log('Using cookie lang=' + Cookie.get('lang'));
    } else if (lang) {
      console.log('Using browser lang=' + lang);
      // this.translate.use(lang);
    } else {
      lang = 'fr';
      console.log('Using default lang=fr');
    }
    this.lang = lang;
    this.count = (this.isHomePage) ? this.counts[0] : this.counts[1];
    this.sort = this.sortings[0];
    if (this.lang === 'en') {
      this.sortings = [
        { code: 'publicationAsc', name: 'New first' },
        { code: 'publicationDesc', name: 'Old first' },
        { code: 'vews', name: 'Views' },
        { code: 'rating', name: 'Rating' }];
    }

    this.searchForm = this.fb.group({
      search: ['', Validators.required]
    });
  }

  ngOnChanges() {
    // console.log(' show toggle - ' ,this.showSidenavToggle)
  }

  public changeCount(count) {
    this.count = count;
    this.onChangeCount.emit(count);
    // this.getAllProducts(); 
  }

  public changeSorting(sort) {
    this.sort = sort;
    this.onChangeSorting.emit(sort.code);
  }

  public changeViewType(viewType, viewCol) {
    this.viewType = viewType;
    this.viewCol = viewCol;
    this.onChangeViewType.emit({ viewType: viewType, viewCol: viewCol });
  }

  public sidenavToggle() {
    this.onSidenavToggle.emit();
  }

  public search(values: Object): void {
    this.onSearchClick.emit(values);
  }
}
