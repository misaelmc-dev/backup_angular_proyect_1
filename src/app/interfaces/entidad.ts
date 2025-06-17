import {Link} from "./link";

export interface Entidad {
  id: number,
  nombre: string,
  rfc: string,
  persona_fisica: string,
  correo: string,
  telefono: string,
  domicilio: string,
  pais: string,
  ciudad: string,
  webpage: string,
  cod_biotime: number,
  cod_postal: string,
  registro_patronal: string,
  tipo_patron: string,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date,
  entidad_superior_id: number
}

export interface EntidadPageable {
  current_page: number;
  data: Entidad [];
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


