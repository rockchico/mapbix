import axios from 'axios';
import {
    useQuery,
    useMutation
} from "react-query";

import { useSession } from 'next-auth/client'




/**
 * Obtêm os grupos do registrados no strapi
 * @returns 
 */
const retrieveConfGroup = async (groupid) => {

    if (!groupid) throw { response: { data: ["groupid não informado"] } }

    const response = await axios.get(`/api/conf/groups/${groupid}`)
    //console.log(response.data)
    return response.data;
}

/**
 * Hook para usar os grupos registratos no strapi
 * @returns 
 */
export const useConfGroup = (groupid) => {

    const queryInfo = useQuery(
        ['conf_groups', parseInt(groupid, 10)],
        () => retrieveConfGroup(groupid),
        {
            //enabled: false
        }
    );

    //console.log(queryInfo.data)

    return {
        ...queryInfo
    }

}