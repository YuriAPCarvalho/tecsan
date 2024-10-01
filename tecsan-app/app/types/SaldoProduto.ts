import { Estoque } from "./Estoque";
import { Fazenda } from "./Fazenda";
import { Produto } from "./Produto";
import { Categoria } from "./Categoria";

export interface SaldoProduto{
    fazendaId: number;
    estoqueId: number;
    produtoId: number;
    saldo: number;
    produto?: Produto;
    fazenda?: Fazenda;
    estoque?: Estoque;
    categoria?: Categoria;
    updatedAt: string;

}
  
