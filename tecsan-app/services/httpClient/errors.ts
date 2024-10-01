export const httpErros: {
    [index: string]: string;
    [index: number]: string;
} =
{
    400: 'Requisição inválida. Verifique os parâmetros enviados.',
    401: 'Acesso não autorizado. Faça login novamente para acessar esta página.',
    403: 'Acesso proibido. Você não tem permissão para acessar este recurso.',
    404: 'Página não encontrada. O recurso solicitado não foi encontrado.',
    500: 'Erro interno do servidor. Tente novamente mais tarde.',
    503: 'Sem conexação com servidor',
    ["ERR_NETWORK"]: "Sem conexação com servidor"
};