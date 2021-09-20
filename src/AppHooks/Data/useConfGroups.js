import axios from 'axios';
import {
    useQuery,
    useMutation,
    useQueryClient
} from "react-query";

/**
 * Obtêm os grupos do registrados no strapi
 * @returns 
 */
const retrieveConfGroups = async () => {
    const response = await axios.get(`/api/conf/groups`)
    //console.log(response.data)
    return response.data;
}

/**
 * Hook para usar os grupos registratos no strapi
 * @returns 
 */
export const useConfGroups = (enabled) => {

    const queryClient = useQueryClient()

    const queryInfo = useQuery(
        'conf_groups',
        () => retrieveConfGroups(),
        {
            refetchOnMount: enabled,
            refetchOnWindowFocus: enabled,
            enabled: enabled,
            // refetchInterval: 60000, // Refetch the data every minute
            onSuccess: (data) => { // no sucesso da operação já provê os dados iniciais da query ['conf_groups', id] com o registeredGroup
                data.forEach(confGroup => {
                    queryClient.setQueryData(['conf_groups', confGroup.groupid], confGroup)
                });
            }
        });

    //console.log(queryInfo.data)

    return {
        ...queryInfo
    }

}