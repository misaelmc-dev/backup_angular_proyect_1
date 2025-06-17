import {Link} from "./link";

export interface Trabajador {
  id: number,
  nombre: string,
  apellidos: string,
  fecha_nacimiento: Date,
  url_foto: string,
  rfc: string,
  curp: string,
  nss: string,
  correo: string,
  domicilio: string,
  genero: string,
  telefono: string,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date
}

export interface TrabajadorPageable {
  current_page: number;
  data: Trabajador [];
  first_page_url: String;
  from: number;
  last_page: number;
  last_page_url: String;
  links: Link[];
  next_page_url: String;
  path: String;
  per_page: number;
  prev_page_url: String;
  to: number;
  total: number;
}
