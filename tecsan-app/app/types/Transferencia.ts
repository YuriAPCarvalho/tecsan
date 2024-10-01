import { Estoque } from "./Estoque";
import { Fazenda } from "./Fazenda";
import { Produto } from "./Produto";
import { Usuario } from "./Usuario";

export interface Transferencia {
    id: number;
    produtoId: string;
    estoqueOrigemId: string;
    fazendaOrigemId: string;
    estoqueDestinoId: string;
    fazendaDestinoId: string;
    quantidade: number;
    usuario?: Usuario;
    produto?:Produto
    estoqueOrigem?:Estoque
    estoqueDestino?:Estoque
    fazendaOrigem?:Fazenda
    fazendaDestino?:Fazenda
    createdAt: Date;

    





 
}
  
