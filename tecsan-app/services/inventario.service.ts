
import { Inventario } from "@/app/types/Inventario"
import httpClientFactory from "./httpClient/_httpClientFactory"
import { ApiResponse } from "./types/ApiResponse"
import { HttpClient } from "./types/Http"
import { Transferencia } from "@/app/types/Transferencia"

class InventarioService {

    rersourceName = "inventarios"

    constructor(readonly httpClient: HttpClient<ApiResponse<any>>) {
    }

    async get(): Promise<ApiResponse<Inventario[]>>  {

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

 
 
};

export const inventarioService = new InventarioService(httpClientFactory())