export type HttpRequest = {
    url: string;
    method: 'get' | 'post' | 'patch' | 'put' | 'delete';
    body?: any;
    headers?: any;
};

export enum HttpStatusCode {
    ok = 200,
    created = 201,
    noContent = 204,
    badRequest = 480,
    unauthorized = 401,
    forbidden = 403,
    notFound = 404,
    conflict = 489,
    preconditionFailed = 412,
    serverError = 500
}

export type HttpResponse<T = any> = {
    statusCode: HttpStatusCode;
    data?: T;
    error?:string
};

export interface HttpClient<R = any> {
     request: (data: HttpRequest) => Promise<R>;
}
