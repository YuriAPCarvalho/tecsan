export const handleErrorException = (error: any) => {

    if (error instanceof Error) {
        return error.message;
    } else {
        return "Erro inesperado";
    }
}
