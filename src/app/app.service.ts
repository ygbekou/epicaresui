import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { News, Location, SearchAttribute, User, AuthToken, GenericResponse, Company, Poll, PollQuestion, Vote, PositionDesc } from './app.models';
import { AppSettings, Settings } from './app.settings';
import { Constants } from './app.constants';
import { TokenStorage } from './token.storage';
import { catchError } from 'rxjs/operators';
import { Menu } from './theme/components/menu/menu.model';
import { Cookie } from 'ng2-cookies/ng2-cookies';

export class Data {
  constructor(public properties: News[],
    public compareList: News[],
    public favorites: News[],
    public locations: Location[]) { }
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private headers: HttpHeaders;
  company: Company = new Company();
  companies: Company[] = [];
  positionDescs: PositionDesc[] = [];
  public menuItems: Array<Menu> = [];
  public Data = new Data(
    [], // properties
    [], // compareList
    [], // favorites
    []  // locations
  )
  public url = 'assets/data/';
  public apiKey = 'AIzaSyA1rF9bttCxRmsNdZYjW7FzIoyrul5jb-s';

  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];

  constructor(public http: HttpClient,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    public appSettings: AppSettings,
    private tokenStorage: TokenStorage) {
    this.headers = new HttpHeaders();
    if (this.tokenStorage.hasToken()) {
      this.headers = this.headers.set('Authorization', 'Bearer ' + this.tokenStorage.getToken());
    }
    this.headers = this.headers.set('Content-Type', 'application/json');
    this.headers = this.headers.set('Accept', 'application/json');
    this.getPositions();
  }

  changeCompany(lang) {
    if (this.companies.length > 0) {
      this.companies.forEach(aCompany => {
        if (lang === aCompany.language) {
          this.company = aCompany;
          this.appSettings.settings =
            new Settings(
              'Bat & Bel',  // theme name
              this.company.themeColor,      // blue, green, red, pink, purple, grey, orange-dark
              this.company.headerTextPosition,           // 0, 1 or 2
              (this.company.fixedMenu === 1 ? true : false),        // true = sticky, false = not sticky
              this.company.headerImageType,   // default, image, carousel
              (this.company.leftToRight === 1 ? true : false),       // true = rtl, false = ltr
              1,           //  1, 2  or 3
              false,       //  true = search on button click
              'USD',       // USD, EUR

              // NOTE:  don't change additional options values, they used for theme performance
              false,
              false,
              false,
              {
                start: false,
                step: 1,
                load: false,
                page: 1,
                complete: false,
                result: 0
              }
            );
          console.log('loging settings');
          console.log(this.appSettings.settings);
        }
      });
    }
  }
  initCompany() {
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
    console.log('app service lang =' + lang);
    const parameters: string[] = [];
    this.getAllByCriteria('Company', parameters)
      .subscribe((data: Company[]) => {
        this.companies = data;
        if (this.companies.length > 0) {
          this.companies.forEach(aCompany => {
            if (lang === aCompany.language) {
              this.company = aCompany;
              this.appSettings.settings =
                new Settings(
                  'Bat & Bel',  // theme name
                  this.company.themeColor,      // blue, green, red, pink, purple, grey, orange-dark
                  this.company.headerTextPosition,           // 0, 1 or 2
                  (this.company.fixedMenu === 1 ? true : false),        // true = sticky, false = not sticky
                  this.company.headerImageType,   // default, image, carousel
                  (this.company.leftToRight === 1 ? true : false),       // true = rtl, false = ltr
                  1,           //  1, 2  or 3
                  false,       //  true = search on button click
                  'USD',       // USD, EUR

                  // NOTE:  don't change additional options values, they used for theme performance
                  false,
                  false,
                  false,
                  {
                    start: false,
                    step: 1,
                    load: false,
                    page: 1,
                    complete: false,
                    result: 0
                  }
                );
              console.log('loging settings');
              console.log(this.appSettings.settings);
            }
          });
        }
      },
        error => console.log(error),
        () => console.log('Get Company complete'));
  }

  public getProperties(): Observable<News[]> {
    return this.http.get<News[]>(this.url + 'properties.json');
  }

  public getPropertyById(id): Observable<News> {
    return this.http.get<News>(this.url + 'news-' + id + '.json');
  }

  public getFeaturedProperties(): Observable<News[]> {
    return this.http.get<News[]>(this.url + 'featured-properties.json');
  }

  public getRelatedProperties(): Observable<News[]> {
    return this.http.get<News[]>(this.url + 'related-properties.json');
  }

  public getPropertiesByAgentId(agentId): Observable<News[]> {
    return this.http.get<News[]>(this.url + 'properties-agentid-' + agentId + '.json');
  }

  public getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.url + 'locations.json');
  }

  public getAddress(lat = 40.714224, lng = -73.961452) {
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + this.apiKey);
  }

  public getLatLng(address) {
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?key=' + this.apiKey + '&address=' + address);
  }

  public getFullAddress(lat = 40.714224, lng = -73.961452) {
   /*  return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + this.apiKey).subscribe(data => {
      return data.results[0].formatted_address;
    }); */
  }

  public addToCompare(news: News, component, direction) {
    if (!this.Data.compareList.filter(item => item.id === news.id)[0]) {
      this.Data.compareList.push(news);
      this.bottomSheet.open(component, {
        direction
      }).afterDismissed().subscribe(isRedirect => {
        if (isRedirect) {
          window.scrollTo(0, 0);
        }
      });
    }
  }

  public addToFavorites(news: News, direction) {
    if (!this.Data.favorites.filter(item => item.id === news.id)[0]) {
      this.Data.favorites.push(news);
      this.snackBar.open('The news "' + news.title + '" has been added to favorites.', '×', {
        verticalPosition: 'top',
        duration: 3000,
        direction
      });
    }
  }

  public getPropertyTypes() {
    return [
      { id: 1, name: 'Office' },
      { id: 2, name: 'House' },
      { id: 3, name: 'Apartment' }
    ]
  }

  public getPropertyStatuses() {
    return [
      { id: 1, name: 'For Sale' },
      { id: 2, name: 'For Rent' },
      { id: 3, name: 'Open House' },
      { id: 4, name: 'No Fees' },
      { id: 5, name: 'Hot Offer' },
      { id: 6, name: 'Sold' }
    ]
  }

  public getCities() {
    return [
      { id: 1, name: 'New York' },
      { id: 2, name: 'Chicago' },
      { id: 3, name: 'Los Angeles' },
      { id: 4, name: 'Seattle' }
    ]
  }

  public getNeighborhoods() {
    return [
      { id: 1, name: 'Astoria', cityId: 1 },
      { id: 2, name: 'Midtown', cityId: 1 },
      { id: 3, name: 'Chinatown', cityId: 1 },
      { id: 4, name: 'Austin', cityId: 2 },
      { id: 5, name: 'Englewood', cityId: 2 },
      { id: 6, name: 'Riverdale', cityId: 2 },
      { id: 7, name: 'Hollywood', cityId: 3 },
      { id: 8, name: 'Sherman Oaks', cityId: 3 },
      { id: 9, name: 'Highland Park', cityId: 3 },
      { id: 10, name: 'Belltown', cityId: 4 },
      { id: 11, name: 'Queen Anne', cityId: 4 },
      { id: 12, name: 'Green Lake', cityId: 4 }
    ]
  }

  public getStreets() {
    return [
      { id: 1, name: 'Astoria Street #1', cityId: 1, neighborhoodId: 1 },
      { id: 2, name: 'Astoria Street #2', cityId: 1, neighborhoodId: 1 },
      { id: 3, name: 'Midtown Street #1', cityId: 1, neighborhoodId: 2 },
      { id: 4, name: 'Midtown Street #2', cityId: 1, neighborhoodId: 2 },
      { id: 5, name: 'Chinatown Street #1', cityId: 1, neighborhoodId: 3 },
      { id: 6, name: 'Chinatown Street #2', cityId: 1, neighborhoodId: 3 },
      { id: 7, name: 'Austin Street #1', cityId: 2, neighborhoodId: 4 },
      { id: 8, name: 'Austin Street #2', cityId: 2, neighborhoodId: 4 },
      { id: 9, name: 'Englewood Street #1', cityId: 2, neighborhoodId: 5 },
      { id: 10, name: 'Englewood Street #2', cityId: 2, neighborhoodId: 5 },
      { id: 11, name: 'Riverdale Street #1', cityId: 2, neighborhoodId: 6 },
      { id: 12, name: 'Riverdale Street #2', cityId: 2, neighborhoodId: 6 },
      { id: 13, name: 'Hollywood Street #1', cityId: 3, neighborhoodId: 7 },
      { id: 14, name: 'Hollywood Street #2', cityId: 3, neighborhoodId: 7 },
      { id: 15, name: 'Sherman Oaks Street #1', cityId: 3, neighborhoodId: 8 },
      { id: 16, name: 'Sherman Oaks Street #2', cityId: 3, neighborhoodId: 8 },
      { id: 17, name: 'Highland Park Street #1', cityId: 3, neighborhoodId: 9 },
      { id: 18, name: 'Highland Park Street #2', cityId: 3, neighborhoodId: 9 },
      { id: 19, name: 'Belltown Street #1', cityId: 4, neighborhoodId: 10 },
      { id: 20, name: 'Belltown Street #2', cityId: 4, neighborhoodId: 10 },
      { id: 21, name: 'Queen Anne Street #1', cityId: 4, neighborhoodId: 11 },
      { id: 22, name: 'Queen Anne Street #2', cityId: 4, neighborhoodId: 11 },
      { id: 23, name: 'Green Lake Street #1', cityId: 4, neighborhoodId: 12 },
      { id: 24, name: 'Green Lake Street #2', cityId: 4, neighborhoodId: 12 }
    ]
  }

  public getFeatures() {
    return [
      { id: 1, name: 'Air Conditioning', selected: false },
      { id: 2, name: 'Barbeque', selected: false },
      { id: 3, name: 'Dryer', selected: false },
      { id: 4, name: 'Microwave', selected: false },
      { id: 5, name: 'Refrigerator', selected: false },
      { id: 6, name: 'TV Cable', selected: false },
      { id: 7, name: 'Sauna', selected: false },
      { id: 8, name: 'WiFi', selected: false },
      { id: 9, name: 'Fireplace', selected: false },
      { id: 10, name: 'Swimming Pool', selected: false },
      { id: 11, name: 'Gym', selected: false },
    ]
  }


  public getHomeCarouselSlides() {
    return this.http.get<any[]>(this.url + 'slides.json');
  }


  public filterData(data, params: any, sort?, page?, perPage?) {
    this.sortData(sort, data);
    return this.paginator(data, page, perPage)
  }

  public sortData(sort, data) {
    if (sort) {
      console.log('Sort called: ' + sort);
      console.log(data);
      switch (sort) {
        case 'publicationAsc':
          data = data.sort((a, b) => { return (new Date(b.publicationDatetime) as any) - (new Date(a.publicationDatetime) as any) });
          console.log('Which one? publicationAsc');
          break;
        case 'publicationDesc':
          data = data.sort((a, b) => { return (new Date(a.publicationDatetime) as any) - (new Date(b.publicationDatetime) as any) });
          console.log('Which one? publicationDesc');
          break;
        case 'rating':
          data = data.sort((a, b) => {
            if (a.rating / a.ratingCount < b.rating / b.ratingCount) {
              return 1;
            }
            if (a.rating / a.ratingCount > b.rating / b.ratingCount) {
              return -1;
            }
            return 0;
          });
          console.log('Which one? rating');
          break;
        case 'vews':
          data = data.sort((a, b) => {
            if (a.viewCount < b.viewCount) {
              return 1;
            }
            if (a.viewCount > b.viewCount) {
              return -1;
            }
            return 0;
          });
          console.log('Which one? views');
          break;
        default:
          break;
      }
    }
    console.log(data);
    return data;
  }

  public paginator(items, page?, perPage?) {
    const page1 = page || 1,
      perPage1 = perPage || 4,
      offset = (page1 - 1) * perPage1,
      paginatedItems = items.slice(offset).slice(0, perPage1),
      totalPages = Math.ceil(items.length / perPage1);
    return {
      data: paginatedItems,
      pagination: {
        page1,
        perPage1,
        prePage: page1 - 1 ? page1 - 1 : null,
        nextPage: (totalPages > page1) ? page1 + 1 : null,
        total: items.length,
        totalPages,
      }
    };
  }



  public getTestimonials() {
    return [
      {
        text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.',
        author: 'Mr. Adam Sandler',
        position: 'General Director',
        image: 'assets/images/profile/adam.jpg'
      },
      {
        text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.',
        author: 'Ashley Ahlberg',
        position: 'Housewife',
        image: 'assets/images/profile/ashley.jpg'
      },
      {
        text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.',
        author: 'Bruno Vespa',
        position: 'Blogger',
        image: 'assets/images/profile/bruno.jpg'
      },
      {
        text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.',
        author: 'Mrs. Julia Aniston',
        position: 'Marketing Manager',
        image: 'assets/images/profile/julia.jpg'
      }
    ];
  }

  public getAgents() {
    return [
      {
        id: 1,
        fullName: 'Lusia Manuel',
        desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',
        organization: 'HouseKey',
        email: 'lusia.m@housekey.com',
        phone: '(224) 267-1346',
        social: {
          facebook: 'lusia',
          twitter: 'lusia',
          linkedin: 'lusia',
          instagram: 'lusia',
          website: 'https://lusia.manuel.com'
        },
        ratingsCount: 6,
        ratingsValue: 480,
        image: 'assets/images/agents/a-1.jpg'
      },
      {
        id: 2,
        fullName: 'Andy Warhol',
        desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',
        organization: 'HouseKey',
        email: 'andy.w@housekey.com',
        phone: '(212) 457-2308',
        social: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          website: 'https://andy.warhol.com'
        },
        ratingsCount: 4,
        ratingsValue: 400,
        image: 'assets/images/agents/a-2.jpg'
      },
      {
        id: 3,
        fullName: 'Tereza Stiles',
        desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',
        organization: 'HouseKey',
        email: 'tereza.s@housekey.com',
        phone: '(214) 617-2614',
        social: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          website: 'https://tereza.stiles.com'
        },
        ratingsCount: 4,
        ratingsValue: 380,
        image: 'assets/images/agents/a-3.jpg'
      },
      {
        id: 4,
        fullName: 'Michael Blair',
        desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',
        organization: 'HouseKey',
        email: 'michael.b@housekey.com',
        phone: '(267) 388-1637',
        social: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          website: 'https://michael.blair.com'
        },
        ratingsCount: 6,
        ratingsValue: 480,
        image: 'assets/images/agents/a-4.jpg'
      },
      {
        id: 5,
        fullName: 'Michelle Ormond',
        desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',
        organization: 'HouseKey',
        email: 'michelle.o@housekey.com',
        phone: '(267) 388-1637',
        social: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          website: 'https://michelle.ormond.com'
        },
        ratingsCount: 6,
        ratingsValue: 480,
        image: 'assets/images/agents/a-5.jpg'
      }
    ];
  }



  public getClients() {
    return [
      { name: 'aloha', image: 'assets/images/clients/aloha.png' },
      { name: 'dream', image: 'assets/images/clients/dream.png' },
      { name: 'congrats', image: 'assets/images/clients/congrats.png' },
      { name: 'best', image: 'assets/images/clients/best.png' },
      { name: 'original', image: 'assets/images/clients/original.png' },
      { name: 'retro', image: 'assets/images/clients/retro.png' },
      { name: 'king', image: 'assets/images/clients/king.png' },
      { name: 'love', image: 'assets/images/clients/love.png' },
      { name: 'the', image: 'assets/images/clients/the.png' },
      { name: 'easter', image: 'assets/images/clients/easter.png' },
      { name: 'with', image: 'assets/images/clients/with.png' },
      { name: 'special', image: 'assets/images/clients/special.png' },
      { name: 'bravo', image: 'assets/images/clients/bravo.png' }
    ];
  }

  public getAll = (entityClass: string): Observable<any[]> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/all';
    return this.http.get<any>(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public getAllByCriteria = (entityClass: string, parameters: string[], orderBy = ''): Observable<any[]> => {
    const searchAttribute = new SearchAttribute();
    searchAttribute.parameters = parameters;
    searchAttribute.orderBy = orderBy;
    const toAdd = JSON.stringify(searchAttribute);
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/allByCriteriaAndOrderBy';
    return this.http.post<any>(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public getAllByCriteriaWithFiles = (entityClass: string, parameters: string[], orderBy = ''): Observable<any[]> => {
    const searchAttribute = new SearchAttribute();
    searchAttribute.parameters = parameters;
    searchAttribute.orderBy = orderBy;
    const toAdd = JSON.stringify(searchAttribute);
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/allByCriteriaAndOrderByAndFiles';
    return this.http.post<any>(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public save = (entity: any, entityClass: string): Observable<any> => {
    entity.modifiedBy = this.tokenStorage.getUserId;
    const toAdd = JSON.stringify(entity);
    const actionUrl = Constants.apiServer + '/service/crud/' + entityClass + '/save';
    return this.http.post<any>(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }


  public saveWithUrl = (url: string, genericObject: any): Observable<any> => {

    const toAdd = JSON.stringify(genericObject);
    const actionUrl = Constants.apiServer + url;
    return this.http.post<any>(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }


  public saveWithFile = (entity: any, entityClass: string, formData: FormData, method: string): Observable<any> => {
    let head = new HttpHeaders();
    if (this.tokenStorage.hasToken()) {
      head = head.set('Authorization', 'Bearer ' + this.tokenStorage.getToken());
    }
    entity.modifiedBy = this.tokenStorage.getUserId;
    const toAdd = JSON.stringify(entity);
    formData.append('dto', new Blob([toAdd],
      {
        type: 'application/json'
      }));

    const actionUrl = Constants.apiServer + '/service/crud/' + entityClass + '/' + method;
    return this.http.post<any>(actionUrl, formData, { headers: head })
      .pipe(catchError(this.handleError));
  }

  public saveWithFileUsingUrl = (url: string, entity: any, formData: FormData): Observable<any> => {
      let head = new HttpHeaders();
      if (this.tokenStorage.hasToken()) {
         head = head.set('Authorization', 'Bearer ' + this.tokenStorage.getToken());
      }
      entity.modifiedBy = this.tokenStorage.getUserId;
      const toAdd = JSON.stringify(entity);
      formData.append('dto', new Blob([toAdd],
         {
            type: 'application/json'
         }));

      const actionUrl = Constants.apiServer + url;
      return this.http.post<any>(actionUrl, formData, { headers: head })
         .pipe(catchError(this.handleError));
   }
   

  public authenticate = (user: User): Observable<AuthToken> => {
    const toAdd = JSON.stringify(user);
    const actionUrl = Constants.apiServer + '/service/token/authenticate';
    return this.http.post<AuthToken>(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public resetPassword = (user: User): Observable<any> => {
    const toAdd = JSON.stringify(user);
    const actionUrl = Constants.apiServer + '/service/user/forgot/sendPassword';
    return this.http.post(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public updateToken() {
    if (this.tokenStorage.hasToken()) {
      this.headers = this.headers.set('Authorization', 'Bearer ' + this.tokenStorage.getToken());
    }
  }

  public saveUserAndLogin = (user: User): Observable<any> => {
    const toAdd = JSON.stringify(user);
    const actionUrl = Constants.apiServer + '/service/user/forgot/saveUserAndLogin';
    return this.http.post(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public getOne = (id: number, entityClass: string): Observable<any> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/' + id;
    return this.http.get(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public getOneWithFiles = (id: number, entityClass: string): Observable<any> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/withfiles/' + id;
    return this.http.get(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public getObject = (url: string): Observable<any> => {
      const actionUrl = Constants.apiServer + url;
      return this.http.get<any>(actionUrl, { headers: this.headers })
         .pipe(catchError(this.handleError));
   }

  public delete = (id: number, entityClass: string): Observable<GenericResponse> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/delete/' + id;
    return this.http.get<GenericResponse>(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public deleteCascade = (id: number, entityClass: string): Observable<GenericResponse> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/deleteCascade/' + id;
    return this.http.get<GenericResponse>(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public getOneWithChildsAndFiles = (id: number, entityClass: string): Observable<any> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/withChildsAndFiles/' + id;
    return this.http.get(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public deleteFile = (entityClass: string, vo: any): Observable<any> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/deletefile';
    return this.http.post<any>(actionUrl, vo, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }


  getFlag() {
    let lang = navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    if (Cookie.get('lang')) {
      lang = Cookie.get('lang');
    } else if (lang) {
    } else {
      lang = 'fr';
    }

    return lang === 'fr' ? this.flags[0] : this.flags[1];
  }

  public vote = (vote: Vote): Observable<any> => {
    const toAdd = JSON.stringify(vote);
    const actionUrl = Constants.apiServer + '/service/poll/vote';
    return this.http.post(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public getPendingPollQuestions = (poll: Poll): Observable<PollQuestion[]> => {
    const actionUrl = Constants.apiServer + '/service/poll/getPendingPollQuestions/' + poll.id + '/' + poll.userId;
    console.log(actionUrl);
    return this.http.get<PollQuestion[]>(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getPositions() {
    const parameters: string[] = [];
    parameters.push('e.language = |langCode|' + this.getFlag().code + '|String');
    this.getAllByCriteria('PositionDesc', parameters)
      .subscribe((data: PositionDesc[]) => {
        this.positionDescs = data;
        console.log(this.positionDescs);
      },
        error => console.log(error),
        () => console.log('Get all PositionDesc complete'));
  }

}
