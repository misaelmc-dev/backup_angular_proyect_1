import { Injectable } from '@angular/core';

@Injectable()
export class GlobalsVars {
  //base_path = 'http://localhost:8000'
  base_path  = 'https://backend.gss-brmanagement.mx'


  backend_base_url = `${this.base_path}/api`;
}
