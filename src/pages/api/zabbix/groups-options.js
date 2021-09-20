const { getSession } = require('next-auth/client')

const zabbix = require('../../../AppServices/zabbix')

export default async function handler(req, res) {

    const session = await getSession({ req })

    // if (!session) {
    //     res.status(401).json(["Operação não permitida. Por favor efetue login."])
    //     return
    // }

    try {

        const groups = await zabbix.getGroupsOptions()
        res.status(200).json(groups)
        return

    } catch (error) {
        res.status(500).json(['Não foi possível obter as informações.']);
        return
    }

}