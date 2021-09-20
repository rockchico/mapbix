const fs = require('fs');
const _ = require('lodash');


export default async function handler(req, res) {

    const groupid = req.query['groupid']
    //console.log('api groupid = ', groupid);

    try {
        const dataMapGroups = fs.readFileSync('src/AppData/mapGroups.json', 'utf8');
        // parse JSON object
        const mapGroups = JSON.parse(dataMapGroups.toString())
        //console.log('mapGroups', JSON.stringify(mapGroups, null, 4));
        const mapGroup = mapGroups.find(g => g.groupid === parseInt(groupid, 10))
        //console.log('mapGroup: ', JSON.stringify(mapGroup, null, 4));

        const mapGroupHistory = {}

        // verifica se o mapGroup possui as info do zabbix
        if (!mapGroup) {

            res.status(400).json(["Grupo não encontrado"])
            return

        }

        const dataMapGroupsHistory = fs.readFileSync('src/AppData/mapGroupsHistory.json', 'utf8');
        const mapGroupsHistory = JSON.parse(dataMapGroupsHistory.toString())
        //console.log('mapGroupsHistory', JSON.stringify(mapGroupsHistory, null, 4));
        //console.log('mapGroup.graphs', JSON.stringify(mapGroup.graphs, null, 4));

        const { download_itemid, upload_itemid, ping_loss_itemid, ping_responsetime_itemid } = mapGroup.info;

        mapGroupHistory[download_itemid] = mapGroupsHistory.filter(gh => gh.itemid === download_itemid)
        mapGroupHistory[upload_itemid] = mapGroupsHistory.filter(gh => gh.itemid === upload_itemid)

        mapGroupHistory[ping_loss_itemid] = mapGroupsHistory.filter(gh => gh.itemid === ping_loss_itemid)
        mapGroupHistory[ping_responsetime_itemid] = mapGroupsHistory.filter(gh => gh.itemid === ping_responsetime_itemid)



        //console.log('mapGroupHistory: ', JSON.stringify(mapGroupHistory, null, 4));


        res.status(200).json(mapGroupHistory)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }



}