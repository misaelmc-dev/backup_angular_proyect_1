import { Component } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gest-seg-social-frontend';
  locale = 'en';
  locales = listLocales();

  constructor(private localeService: BsLocaleService) {
    this.localeService.use(this.locale);
  }

}
