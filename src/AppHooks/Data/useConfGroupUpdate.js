import axios from 'axios';
import {
    useQuery,
    useMutation,
    useQueryClient,
    queryCache
} from "react-query";

// updateConfGroup
/**
 * Atualiza confGroup
 * @param {*} data 
 * @returns 
 */
const updateConfGroup = async (data) => {

    const bodyParameters = {
        ...data
    };

    const response = await axios.patch(
        `/api/conf/groups/${data.groupid}`,
        bodyParameters,
        //config
    )

    return response.data;
}

export const useConfGroupUpdate = () => {

    const queryClient = useQueryClient()

    const mutationInfo = useMutation(
        (data) => updateConfGroup(data),
        {

            onMutate: (variables) => {

                // A mutation is about to happen!

                queryClient.cancelQueries('conf_groups')

                const oldConfGroup = queryClient.getQueryData(['conf_groups', variables.groupid])

                queryClient.setQueryData(['conf_groups', variables.groupid], variables)

                return () => queryClient.setQueryData(['conf_groups', variables.groupid], oldConfGroup)

                // Optionally return a context containing data to use when for example rolling back

                //return { id: 1 }

            },
            onError: (error, _new, rollback) => {

                //console.log(error)

                // se houver erro executa a função rollback, retornada em onMutate
                rollback()


            },
            onSuccess: (data, variables) => {


                //queryClient.invalidateQueries(['conf_groups'])
                //queryClient.invalidateQueries(['conf_groups', variables.groupid])

                //queryClient.refetchQueries(['conf_groups'])
                //await queryClient.refetchQueries(['conf_groups', variables.groupid])

                queryClient.refetchQueries("conf_groups")
            },
        }
    )

    //console.log(mutationInfo.data)

    return {
        ...mutationInfo
    }

}