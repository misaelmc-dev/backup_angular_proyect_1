import {Link} from "./link";

export interface Proyecto {
  id: number,
  nombre: string,
  registro_obra: string,
  superficie: string,
  reg_obra_propietario_o_num_aviso_ubic_obra: string,
  tipo: string,
  clase: string,
  monto: string,
  fecha_inicio_tentativa: Date,
  fecha_fin_tentativa: Date,
  fecha_inicio: Date,
  fecha_fin: Date,
  ubicacion: string,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date,
  cod_biotime: number
}

export interface ProyectoPageable {
  current_page: number;
  data: Proyecto [];
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
