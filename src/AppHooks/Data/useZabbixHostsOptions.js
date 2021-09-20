import axios from 'axios';
import {
    useQuery,
    useMutation
} from "react-query";

/**
 * Obtêm os grupos do zabbix para popular selectbox formulário
 * @returns 
 */
const retrieveZabbixHosts = async (groupid) => {
    
    if (!groupid) throw { response: { data: ["groupid não informado"] } }
    
    const response = await axios.get(`/api/zabbix/hosts-options?groupid=${groupid}`)
    //console.log(response.data)
    return response.data;
}


/**
 * Hook para usar array de grupos do zabbix no formato [{groupid: X, name: Y}]
 * @returns 
 */
export const useZabbixHostsOptions = (groupid) => {

    const queryInfo = useQuery(
        ['zabbix_hosts_options', groupid],
        () => retrieveZabbixHosts(groupid),
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