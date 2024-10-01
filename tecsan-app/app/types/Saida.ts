import { Estoque } from "./Estoque";
import { Fazenda } from "./Fazenda";
import { Produto } from "./Produto";
import { Usuario } from "./Usuario";

export interface Saida {
    id: number;
    quantidade: number;
    createdAt: Date;
    usuario?:Usuario
    tipoSaida: string;
    produto?: Produto
    estoque?: Estoque
    fazenda?: Fazenda
    produtoId: string
    estoqueId: string
    fazendaId: string
}

