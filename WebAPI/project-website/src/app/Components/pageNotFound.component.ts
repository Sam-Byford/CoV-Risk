import { Component } from '@angular/core';
import { AppService } from '../app.service'

@Component({
  selector: 'not-found',
  templateUrl: './pageNotFound.component.html',
  styleUrls: []
})
export class PageNotFoundComponent {
  constructor(private _appService: AppService) { }
  appService = this._appService

  ngOnInit() {
    //this.entryPages();
  }
}
