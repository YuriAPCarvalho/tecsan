
import { Produto } from "@/app/types/Produto"
import httpClientFactory from "./httpClient/_httpClientFactory"
import { ApiResponse } from "./types/ApiResponse"
import { HttpClient } from "./types/Http"

class SaldoProdutoService {
    rersourceName = "saldos"

    constructor(readonly httpClient: HttpClient<ApiResponse<any>>) {
    }

    async get(params?: { categoriaId?: number, fazendaId?: number, estoqueId?: number, produtoId?: number }): Promise<ApiResponse<Produto[]>>  {

        const queryParams = new URLSearchParams();

        if (params) {
            if (params.categoriaId !== undefined) queryParams.append('categoriaId', params.categoriaId.toString());
            if (params.fazendaId !== undefined) queryParams.append('fazendaId', params.fazendaId.toString());
            if (params.estoqueId !== undefined) queryParams.append('estoqueId', params.estoqueId.toString());
            if (params.produtoId !== undefined) queryParams.append('produtoId', params.produtoId.toString());
        }

        const url = `/${this.rersourceName}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

        return await this.httpClient.request({
            method: 'get',
            url: `/${this.rersourceName}`,
        })

    }

    async post(formData: any): Promise<ApiResponse<any>> {

        return await this.httpClient.request({
            method: 'post',
            url: `/${this.rersourceName}`,
            body:formData,           
        })

    }

    async patch(id: any, formData: any): Promise<ApiResponse<any>> {
       
        return await this.httpClient.request({
            method: 'patch',
            url: `/${this.rersourceName}/${id}`,
            body: formData,           
        })
    }
};

export const saldoProdutoService = new SaldoProdutoService(httpClientFactory())