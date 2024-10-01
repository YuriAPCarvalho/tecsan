import { Usuario } from "./Usuario";

export interface Inventario {
    fazendaId: number;
    estoqueId: number;
    produtoId: number;
    quantidadeAnterior: number;
    quantidadeAtual: number;
    usuarioId: number;
    updatedAt: string;
    usuario?:Usuario
}

