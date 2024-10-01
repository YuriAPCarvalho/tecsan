import { Estoque } from "./Estoque";
import { Fazenda } from "./Fazenda";
import { Produto } from "./Produto";
import { Usuario } from "./Usuario";

export interface Entrada {
    id: number;
    produtoId: string;
    quantidade: number;
    valor: number;
    createdAt: Date;
    fazendaId: string;
    estoqueId: string;
    produto?:Produto
    estoque?:Estoque
    fazenda?:Fazenda
    usuario?:Usuario
}
  
