import axios from 'axios';
import {
    useQuery,
    useQueryClient
} from "react-query";

/**
 * Obtêm os grupos do zabbix para popular selectbox formulário
 * @returns 
 */
const retrieveZabbixItems = async (hostid) => {

    if (!hostid) throw { response: { data: ["groupid não informado"] } }

    const response = await axios.get(`/api/zabbix/items-options?hostid=${hostid}`)
    //console.log(response.data)
    return response.data;
}


/**
 * Hook para usar array de items do zabbix no formato [{groupid: X, name: Y}]
 * @returns 
 */
export const useZabbixItemsOptions = (hostid) => {

    const queryClient = useQueryClient()

    const queryInfo = useQuery(
        ['zabbix_items_options', hostid],
        () => retrieveZabbixItems(hostid),
        {
            //refetchOnMount: enabled,
            //refetchOnWindowFocus: enabled,
            enabled: false,
            cacheTime: 0,
            // refetchInterval: 60000, // Refetch the data every minute

            onSettled: () => {

                //queryClient.invalidateQueries(['zabbix_items_options', hostid])
                //console.log('zabbix_items_options, onSettled')

            },

        });

    //console.log(queryInfo.data)

    return {
        ...queryInfo
    }

}