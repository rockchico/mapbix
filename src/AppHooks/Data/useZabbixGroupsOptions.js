import axios from 'axios';
import {
    useQuery,
    useMutation
} from "react-query";

import { useSession } from 'next-auth/client'


/**
 * Obtêm os grupos do zabbix para popular selectbox formulário
 * @returns 
 */
const retrieveZabbixGroups = async () => {
    const response = await axios.get(`/api/zabbix/groups-options`)
    //console.log(response.data)
    return response.data;
}


/**
 * Hook para usar array de grupos do zabbix no formato [{groupid: X, name: Y}]
 * @returns 
 */
export const useZabbixGroupsOptions = () => {

    const queryInfo = useQuery(
        'zabbix_groups_options',
        retrieveZabbixGroups,
        {
            //refetchOnMount: enabled,
            //refetchOnWindowFocus: enabled,
            enabled: false,
            cacheTime: 0
            // refetchInterval: 60000, // Refetch the data every minute
        });

    //console.log(queryInfo.data)

    return {
        ...queryInfo
    }

}