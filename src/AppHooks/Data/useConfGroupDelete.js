import axios from 'axios';
import {
    useQuery,
    useMutation,
    useQueryClient
} from "react-query";




/**
 * Exclui um confGroup
 * @param {*} data 
 * @returns 
 */
const deleteConfGroup = async (groupid) => {


    if (!groupid) throw { response: { data: ["groupid não informado"] } }

    //console.log(data)

    // const config = {
    //     headers: { Authorization: `Bearer ${data.jwt}` }
    // };

    // const bodyParameters = {
    //     ...data
    // };

    const response = await axios.delete(
        `/api/conf/groups/${groupid}`,
        //bodyParameters,
        //config
    )

    return response.data;
}

export const useConfGroupDelete = () => {

    const queryClient = useQueryClient()

    const mutationInfo = useMutation(
        (groupid) => deleteConfGroup(groupid),
        {

            onMutate: (variables) => {

                // A mutation is about to happen!

                //console.log(variables)

                // Optionally return a context containing data to use when for example rolling back

                //return { id: 1 }

            },
            onError: (error, variables, rollback) => {
                rollback && rollback()
            },
            onSuccess: (data, variables) => {
                //queryClient.invalidateQueries('conf_groups')
                queryClient.refetchQueries('conf_groups')
            },

        })

    return {
        ...mutationInfo
    }

}