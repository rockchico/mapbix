import axios from 'axios';
import {
    useQuery,
    useMutation,
    useQueryClient
} from "react-query";


/**
 * Cria/adiciona um novo grupo conf
 * @param {*} data 
 * @returns 
 */
const createConfGroup = async (data) => {

    // const config = {
    //     headers: { Authorization: `Bearer ${data.jwt}` }
    // };

    const bodyParameters = {
        ...data
    };

    const response = await axios.post(
        `/api/conf/groups`,
        bodyParameters,
        //config
    )

    return response.data;
}

export const useConfGroupCreate = () => {

    // Get QueryClient from the context

    const queryClient = useQueryClient()

    const mutationInfo = useMutation(

        (data) => createConfGroup(data),
        {

            onMutate: (newConfGroup) => {

                // A mutation is about to happen!

                // faz um snapshot dos posts
                const oldConfGroups = queryClient.getQueryData('conf_groups')

                // optimisticamente atualizando o front, a lista de posts com o novo post 
                if (queryClient.getQueryData('conf_groups')) {
                    queryClient.setQueryData('conf_groups', old => {
                        return [...old, newConfGroup]
                    })
                }


                // se algo der errado, retorna uma função de rollback, setando q query 'conf_groups' com os dados antigos
                return () => queryClient.setQueryData('conf_groups', oldConfGroups);



            },

            onSuccess: (post, variables) => {
                // invalida q query 'conf_groups' fazendo com que seja feita uma nova requisição
                //queryClient.invalidateQueries('conf_groups')
                queryClient.refetchQueries('conf_groups')
            },


            onError: (error, _newPost, rollback) => {

                console.log(error)

                // se houver erro executa a função rollback, retornada em onMutate
                rollback()


            },

            onSettled: (data, error, variables, context) => {

                // Error or success... doesn't matter!
                //queryClient.invalidateQueries('conf_groups')
            },

        })

    return {
        ...mutationInfo
    }

}