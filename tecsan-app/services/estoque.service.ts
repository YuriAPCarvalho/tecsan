
import { Estoque } from "@/app/types/Estoque"
import httpClientFactory from "./httpClient/_httpClientFactory"
import { ApiResponse } from "./types/ApiResponse"
import { HttpClient } from "./types/Http"

class EstoqueService {

    rersourceName = "estoques"

    constructor(readonly httpClient: HttpClient<ApiResponse<any>>) {
    }

    async getAtivo(): Promise<ApiResponse<Estoque[]>>  {

        return await this.httpClient.request({
            method: 'get',
            url: `/${this.rersourceName}/ativo`
        })

    }

    async post(values: any): Promise<ApiResponse<any>> {

        return await this.httpClient.request({
            method: 'post',
            url: `/${this.rersourceName}`,
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
            }
        })

    }

    async patch(id: any, values: any): Promise<ApiResponse<any>> {
        return await this.httpClient.request({
            method: 'patch',
            url: `/${this.rersourceName}/${id}`,
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
            }
        })
                
    }
 
};

export const estoqueService = new EstoqueService(httpClientFactory())