import axios from 'axios';
import {
    useQuery,
    useMutation,
    useQueryClient
} from "react-query";

import { useSession } from 'next-auth/client'




/**
 * Obtêm os dados para população do mapa
 * @returns data
 */
const retrieveMapGroups = async () => {
    //const response = await axios.get(`/api/map/groups`)
    const response = await axios.get(`/api/map/groups`)
    //console.log(response.data)
    return response.data;
}

/**
 * Hook para usar os dados do zabbix no mapa, podendo filtrar os grupos por nome e severidade 
 */
export const useMapGroups = (severity = null, search = '') => {

    const queryClient = useQueryClient()
    
    const queryInfo = useQuery(
        'map_groups',
        retrieveMapGroups,
        {
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            enabled: true,
            refetchInterval: 30000, // Refetch the data every 30s
            onSuccess: (data) => { // no sucesso da operação já provê os dados iniciais da query ['map_groups', id] com o registeredGroup
                data.forEach(mapGroup => {
                    queryClient.setQueryData(['map_groups', mapGroup.groupid], mapGroup)
                });
            }
        });
    //const queryInfo = useQuery('get_zabbix_data', getZabbixData);

    //console.log(search)

    return {
        ...queryInfo,
        data: queryInfo.data?.map((group) => {

            return group;

        }).filter((group) => {

            if (search) {

                if (group.info.nome.toUpperCase().includes(search.toUpperCase())) {

                    //console.log(search)

                    return true
                }
            } else {
                if (severity === null) {
                    return true
                }


                if (group.maxPriority === severity) {
                    return true
                }
            }

            return false

        })
    }

}