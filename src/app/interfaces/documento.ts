import {Link} from "./link";
import {Frecuencia} from "./frecuencia";
import { Tipo } from "./tipo";

export interface Documento {
  id: number,
  nombre: string,
  frecuencia_documento_id: number,
  tipo_id: number,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date,
  nomenclatura_nombre_archivo: string,
  frecuencia: Frecuencia,
  tipo: Tipo
}

export interface DocumentoPageable {
  current_page: number;
  data: Documento [];
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


