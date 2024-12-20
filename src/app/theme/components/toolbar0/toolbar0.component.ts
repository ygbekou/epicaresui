import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-toolbar0',
  templateUrl: './toolbar0.component.html'
})
export class Toolbar0Component implements OnInit {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onMenuIconClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(public appService:AppService) {
  }

  ngOnInit() {

  }

  public sidenavToggle(){
    this.onMenuIconClick.emit();
  }


}