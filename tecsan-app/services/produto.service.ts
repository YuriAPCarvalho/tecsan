
import { Produto } from "@/app/types/Produto"
import httpClientFactory from "./httpClient/_httpClientFactory"
import { ApiResponse } from "./types/ApiResponse"
import { HttpClient } from "./types/Http"

class ProdutoService {
    rersourceName = "produtos"

    constructor(readonly httpClient: HttpClient<ApiResponse<any>>) {
    }

    async getAtivo(): Promise<ApiResponse<Produto[]>>  {

        return await this.httpClient.request({
            method: 'get',
            url: `/${this.rersourceName}/ativo`
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

export const produtoService = new ProdutoService(httpClientFactory())