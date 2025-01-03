export const handlePromise = async ( promise: Promise<any> ) => {
    try {
        const response = await promise;
        return response;
    } catch (error) {
        throw new Error( 'Erro ao buscar conteudo' + error );   
    };
};