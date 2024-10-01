
import { Usuario } from "@/app/types/Usuario"
import httpClientFactory from "./httpClient/_httpClientFactory"
import { ApiResponse } from "./types/ApiResponse"
import { HttpClient } from "./types/Http"

class UsuarioService {

    constructor(readonly httpClient: HttpClient<ApiResponse<any>>) {
    }

    async getAtivo(): Promise<ApiResponse<Usuario[]>>  {

        return await this.httpClient.request({
            method: 'get',
            url: '/usuarios/ativo'
        })

    }

    async post(values: any): Promise<ApiResponse<any>> {

        return await this.httpClient.request({
            method: 'post',
            url: '/usuarios',
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
            }
        })

    }

    async patch(id: any, values: any): Promise<ApiResponse<any>> {
        return await this.httpClient.request({
            method: 'patch',
            url: `/usuarios/${id}`,
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
            }
        })
                
    }
 
};

export const usuarioService = new UsuarioService(httpClientFactory())