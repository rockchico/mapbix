const { getSession } = require('next-auth/client')

const zabbix = require('../../../AppServices/zabbix')

export default async function handler(req, res) {

    const session = await getSession({ req })

    // if (!session) {
    //     res.status(401).json(["Operação não permitida. Por favor efetue login."])
    //     return
    // }


    const {
        query: { groupid },
    } = req;

    if(!groupid) {
        res.status(404).json(['Parâmetro não encontrado'])
        return
    }

    try {

        const hosts = await zabbix.getHostsOptions(groupid)
        res.status(200).json(hosts)
        return

    } catch (error) {
        res.status(500).json(['Não foi possível obter as informações.']);
        return
    }

}