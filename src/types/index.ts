export interface Departamento {
  id: string;
  name: string;
}

export interface Familia {
  id: string;
  name: string;
  claseId: string;
}

export interface Clase {
  id: string;
  name: string;
  departamentoId: string;
}
