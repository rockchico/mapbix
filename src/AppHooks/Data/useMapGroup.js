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
const retrieveMapGroup = async (groupid) => {
    const response = await axios.get(`/api/map/groups/${groupid}`)
    //console.log(response.data)
    return response.data;
}

/**
 * Hook para usar os grupos registratos no strapi
 * @returns 
 */
export const useMapGroup = (groupid) => {

    const queryClient = useQueryClient();
    
    const queryInfo = useQuery(
        ['map_groups', groupid],
        () => retrieveMapGroup(groupid),
        {
            /*
                Desabilitando a query, com isso sempre será retornado os dados de initialData. 
                Com isso não é feita nenhuma requisição, a queryFn não é utilizada
            */
            enabled: false,
            initialStale: true, 
            initialData: () => {

                // Procura o grupo na query map_groups e seta os dados iniciais
                return queryClient.getQueryData('map_groups')?.find(g => g.groupid === groupid)
         
            },
        }
    );

    //console.log(queryInfo.data)

    return {
        ...queryInfo
    }

}