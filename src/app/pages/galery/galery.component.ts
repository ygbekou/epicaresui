import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EmbedVideoService } from 'ngx-embed-video';
import { AppService } from 'src/app/app.service';
import { AppSettings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { GalleryItem, ImageItem } from '@ngx-gallery/core';


@Component({
  selector: 'app-galery',
  templateUrl: './galery.component.html',
  styleUrls: ['./galery.component.scss']
})
export class GaleryComponent extends BaseComponent {
  images: GalleryItem[] = []; // Array to store selected files

  constructor(public appSettings: AppSettings,
    public appService: AppService,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute,
    private embedService: EmbedVideoService,
    public fb: FormBuilder) {
    super(translate, tokenStorage);
  }

  ngOnInit(): void {
    // Liste des images avec leurs sources et miniatures
    this.images = [
      new ImageItem({ 
        src: 'assets/images/projects/4/project_4_0.jpg', 
        thumb: 'assets/images/image1-thumb.jpg' 
      }),
      new ImageItem({ 
        src: 'assets/images/projects/4/project_4_1.jpg', 
        thumb: 'assets/images/image2-thumb.jpg' 
      }),
      new ImageItem({ 
        src: 'assets/images/projects/4/project_4_2.jpg', 
        thumb: 'assets/images/image3-thumb.jpg' 
      }),
      new ImageItem({ 
        src: 'assets/images/projects/4/project_4_3.jpg', 
        thumb: 'assets/images/image4-thumb.jpg' 
      })
    ];
  }

}
