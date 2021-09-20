import axios from 'axios';
import {
    useQuery,
    useMutation,
    useQueryClient
} from "react-query";

import { useSession } from 'next-auth/client'




/**
 * Obtêm o grupo do mapa
 * @returns 
 */
const retrieveMapGroupHistory = async (groupid) => {
    const response = await axios.get(`/api/map/groups/history/${groupid}`)
    //console.log(response.data)
    return response.data;
}

/**
 * Hook para usar os grupos registratos no strapi
 * @returns 
 */
export const useMapGroupHistory = (groupid) => {

    const queryClient = useQueryClient();
    
    const queryInfo = useQuery(
        ['map_group_history', groupid],
        () => retrieveMapGroupHistory(groupid),
        {
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            enabled: true,
            refetchInterval: 60000, // Refetch the data every minute
            onSuccess: (data) => { // no sucesso da operação já provê os dados iniciais da query ['map_groups', id] com o registeredGroup
                //data.forEach(mapGroup => {
                //    queryClient.setQueryData(['map_groups', mapGroup.groupid], mapGroup)
                //});
            }
        }
    );

    //console.log(queryInfo.data)

    return {
        ...queryInfo
    }

}