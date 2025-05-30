import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { Settings, AppSettings } from '../../app.settings';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-header-image-small',
  templateUrl: './header-image-small.component.html',
  styleUrls: ['./header-image-small.component.scss']
})
export class HeaderImageSmallComponent implements OnInit {
  @Input('backgroundImage') backgroundImage;
  @Input('bgImageAnimate') bgImageAnimate;
  @Input('contentOffsetToTop') contentOffsetToTop;
  @Input('contentMinHeight') contentMinHeight;
  @Input('title') title;
  @Input('desc') desc;
  @Input('isHomePage') isHomePage: boolean = false;
  public bgImage;
  public settings: Settings;
  constructor(public appSettings: AppSettings,
    public appService: AppService,
    private sanitizer: DomSanitizer) {
    this.settings = appService.appSettings.settings;
    setTimeout(() => {
      this.settings.headerBgImage = true;
    });
  }

  ngOnInit() {
    if (this.contentOffsetToTop) {
      setTimeout(() => {
        this.settings.contentOffsetToTop = this.contentOffsetToTop;
      });
    }
    if (this.backgroundImage) {
      this.bgImage = this.sanitizer.bypassSecurityTrustStyle('url(' + this.backgroundImage + ')');
    }
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.settings.headerBgImage = false;
      this.settings.contentOffsetToTop = false;
    });
  }

}
