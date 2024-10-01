
import httpClientFactory from "./httpClient/_httpClientFactory"
import { ApiResponse } from "./types/ApiResponse"
import { HttpClient } from "./types/Http"
import { Entrada } from "@/app/types/Entrada"

class EntradaService {

    rersourceName = "entradas"

    constructor(readonly httpClient: HttpClient<ApiResponse<any>>) {
    }

    async get(): Promise<ApiResponse<Entrada[]>>  {

        return await this.httpClient.request({
            method: 'get',
            url: `/${this.rersourceName}`
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

    async delete(id: any): Promise<ApiResponse<any>> {        
        return await this.httpClient.request({ method: 'delete', url: `/${this.rersourceName}/${id}`, })
    }
 
};

export const entradaService = new EntradaService(httpClientFactory())