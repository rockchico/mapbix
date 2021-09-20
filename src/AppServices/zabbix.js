const axios = require('axios');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');


const ZABBIX_API_URL = process.env.ZABBIX_API_URL;
const ZABBIX_API_USER = process.env.ZABBIX_API_USER;
const ZABBIX_API_PASSWORD = process.env.ZABBIX_API_PASSWORD;
const ZABBIX_API_GROUPS_SEARCH = process.env.ZABBIX_API_GROUPS_SEARCH.split(',');



const zabbixRequest = async (body) => {

    let data;
    let error;



    try {


        // fetch data from a url endpoint
        const response = await axios.post(ZABBIX_API_URL, body);
        data = await response.data;

    } catch (err) {
        //alert(error); // catches both errors
        if (err.response) {
            // client received an error response (5xx, 4xx)
        } else if (err.request) {
            // client never received a response, or request never left
        } else {
            // anything else
        }

        console.log('erro no zabbixRequest', err)

        error = err
    }


    return { data, error }

}

const getHostsIds = async (groups) => {

    const hostsIds = []

    groups.forEach(group => {

        const { hosts } = group

        hosts.forEach(host => {
            hostsIds.push(host.hostid)
        })
    })

    return hostsIds
}

const buildAssociations = async (appGroups, groupsZabbix, hostsZabbix, triggersZabbix) => {


    groupsZabbix.forEach((group, i) => {


        //const { hosts } = group
        const ids = group.hosts.map(host => host.hostid)
        //console.log(ids)

        // filtra os hostsZabbix retornando apenas aqueles que estão relacionados ao grupo\
        const groupHosts = _.filter(hostsZabbix, (o) => _.includes(ids, o.hostid))
        group.hosts = groupHosts

        // encontra o appGroup relativo ao grupo do zabbix
        const groupInfo = _.find(appGroups, ['groupid', group.groupid]);

        // info contém as informações cadastradas no banco
        group.info = {};

        // indica se há alarme de consume de banda
        group.bandwidthAlarm = false;

        group.info = {
            ...groupInfo,
            nome: group.name
        };


        const graphItems = [
            {
                itemid: groupInfo.upload_itemid,
                graphName: 'nome do gráfico',
                direction: 'upload',
                interface: 'teste',
            },
            {
                itemid: groupInfo.download_itemid,
                graphName: 'nome do gráfico',
                direction: 'download',
                interface: 'teste',
            }
        ]

        group.graphs = _.groupBy(graphItems, 'interface');


        // filtra os triggers e adiciona na propriedade triggers do host
        const priorities = [];
        group.hosts.map(host => {
            const triggers = _.filter(triggersZabbix, (tz) => host.hostid == tz.hosts[0].hostid)
            //host.triggers = _.orderBy(triggers, ['priority'], ['desc']);
            host.triggers = triggers;
            //host.triggers = _.sortBy(triggers, [function(t) { return t.priority; }]);


            _.forEach(triggers, function (t) {

                // caso for uma trigger desastre (priority=5) e pertencer ao host principal, aumenta a prioridade para 6
                try {
                    const priority = (t.priority == 5 && (group.info.main_hostid === parseInt(host.hostid, 10))) ? 6 : t.priority;
                    priorities.push(priority);
                } catch (error) {
                    priorities.push(t.priority);
                }

            });


        })

        const maxPriority = _.max(_.flatMapDeep(priorities));
        group.maxPriority = (maxPriority ? maxPriority : 0);


    })


    //return { groupsZabbix, hostsZabbix, triggersZabbix }
    // retorna a lista de grupos ordenada pela severidade, em ordem maior para menor e depois pelo nome

    const validGroups = _.filter(groupsZabbix, (o) => (!_.isNaN(o.info.latitude) && !_.isNaN(o.info.longitude)))
    return _.orderBy(validGroups, ['maxPriority', 'name'], ['desc', 'asc']);
}




const zabbixLogin = async () => {

    const body = {
        "jsonrpc": "2.0",
        "method": "user.login",
        "params": {
            "user": ZABBIX_API_USER,
            "password": ZABBIX_API_PASSWORD
        },
        "id": 14,
        "auth": null
    };

    //console.log('zabbixLogin body: ', JSON.stringify(body, null, 4))

    const login = await zabbixRequest(body);

    return login?.data?.result

}

const getGroups = async (auth, groupids = []) => {

    //console.log('ZABBIX_API_GROUPS_SEARCH', ZABBIX_API_GROUPS_SEARCH)

    const body = {
        "jsonrpc": "2.0",
        "method": "hostgroup.get",
        "params": {
            "groupids": groupids,
            "selectHosts": [
                "hostid",
                "name"
            ],
            "output": "extend",
            //"search": {
            //    "name": ZABBIX_API_GROUPS_SEARCH
            //},
            "searchByAny": true,
            "searchWildcardsEnabled": true
        },
        "auth": auth,
        "id": 1
    }

    // se o grouids não for FALSE, seta os groups ids
    // caso for FALSE, retorna todos os grupos
    if (groupids !== false) {
        body.params.groupids = groupids;
    }

    const groups = await zabbixRequest(body);

    groups?.data?.result?.map((h, index) => {
        return _.forIn(h, function (value, key) {
            //console.log("key: ", key);
            //console.log("value: ", value);
            if (key === 'groupid') {
                h[key] = parseInt(value, 10)
            }
        });
    })

    /*
    try {
        const appGroupsData = JSON.stringify(groups, null, 4);
        fs.writeFileSync('src/AppData/appGroupsDataDebug.json', appGroupsData);
        console.log("appGroupsDataDebug JSON salvo.");

    } catch (err) {
        console.error(err);
    }
    */

    return groups?.data?.result;

}

const getGroupsOptions = async (auth) => {

    //console.log('ZABBIX_API_GROUPS_SEARCH', ZABBIX_API_GROUPS_SEARCH)

    const body = {
        "jsonrpc": "2.0",
        "method": "hostgroup.get",
        "params": {
            "output": ['groupid', 'name'],
            "search": {
                "name": ZABBIX_API_GROUPS_SEARCH
            },
            "searchByAny": true,
            "searchWildcardsEnabled": true
        },
        "auth": auth,
        "id": 1
    }


    const groups = await zabbixRequest(body);

    groups?.data?.result?.map((h, index) => {
        return _.forIn(h, function (value, key) {
            //console.log("key: ", key);
            //console.log("value: ", value);
            if (key === 'groupid') {
                h[key] = parseInt(value, 10)
            }

        });
    })


    //console.log(JSON.stringify(groups?.data?.result, null, 4))


    return groups?.data?.result;

}


const getHostsOptions = async (auth, groupid) => {

    const body = {
        "jsonrpc": "2.0",
        "method": "host.get",
        "params": {
            "groupids": groupid,
            "output": [
                "hostid",
                "name",
            ],
            "filter": {
                //"hostid": hostsids,
                "status": "0"
            }
        },
        "id": 1,
        "auth": auth
    }

    const hosts = await zabbixRequest(body);

    hosts?.data?.result?.map((h, index) => {
        return _.forIn(h, function (value, key) {
            //console.log("key: ", key);
            //console.log("value: ", value);
            if (key === 'hostid') {
                h[key] = parseInt(value, 10)
            }

        });
    })

    return hosts?.data?.result;

}

/*

Filtra somente os itens suportados e ativos do tipo Numeric unsigned

https://www.zabbix.com/documentation/current/manual/api/reference/item/object
state 	integer 	(readonly) State of the item.
Possible values:
0 - (default) normal;
1 - not supported.

status 	integer 	Status of the item.
Possible values:
0 - (default) enabled item;
1 - disabled item. 

value_type
(required) 	integer 	Type of information of the item.

Possible values:
0 - numeric float;
1 - character;
2 - log;
3 - numeric unsigned;
4 - text. 

*/
const getItemsOptions = async (auth, hostid) => {

    const body = {
        "jsonrpc": "2.0",
        "method": "item.get",
        "params": {
            "output": [
                "itemid",
                "name",
            ],
            "filter": {
                "state": 0,
                "status": 0,
                "value_type": [0, 3],
                "hostid": hostid
            },
        },
        "id": 1,
        "auth": auth
    }

    //console.log(JSON.stringify(body, null, 4))

    const items = await zabbixRequest(body);

    items?.data?.result?.map((h, index) => {
        return _.forIn(h, function (value, key) {
            //console.log("key: ", key);
            //console.log("value: ", value);
            if (key === 'itemid') {
                h[key] = parseInt(value, 10)
            }

        });
    })

    return items?.data?.result;

}






const getHosts = async (auth, hostsids = []) => {

    const body = {
        "jsonrpc": "2.0",
        "method": "host.get",
        "params": {
            "hostids": hostsids,
            "output": [
                "hostid",
                "name",
                "host",
                "maintenance_status",
                "maintenance_from",
                "status"
            ],
            //"selectTags": ["tag", "value"],
            //"selectInventory": [
            //    "alias",
            //    "host_networks",
            //    "name",
            //    "location_lat",
            //    "location_lon",
            //    "installer_name",
            //    "tag",
            //    "poc_1_phone_a",
            //    "poc_1_phone_b",
            //    "poc_1_name",
            //    "hw_arch",
            //    "type"
            //],
            //"selectMacros": [
            //    "macro",
            //    "value",
            //    "hostmacroid"
            //],
            "selectInterfaces": [
                "ip"
            ],
            //"selectItems": [
            //    "itemid",
            //    "name"
            //],
            "filter": {
                //"hostid": hostsids,
                "status": "0"
            }
        },
        "id": 1,
        "auth": auth
    }

    const hosts = await zabbixRequest(body);

    return hosts?.data?.result;

}

/*
{
    "jsonrpc": "2.0",
    "method": "item.get",
    "params": {
            "output": [
                "itemid",
                "name",
                "key_"
            ],
            "groupids": ["24"],
            "selectTags": [
                    "tag",
                    "value"
            ],
            "tags": [
                {"tag": "GRAPH", "value": "upload", "operator": "1"}
            ]
    },
    "id": 1,
    "auth": "bfe3717485d7180a3eae35e1b3f52280"
}
*/

const getItems = async (auth, itemids = [], tag) => {

    const body = {
        "jsonrpc": "2.0",
        "method": "item.get",
        "params": {
            "output": [
                "itemid",
                "hostid",
                "name",
                "key_"
            ],
            "itemids": itemids,
            "selectTags": [
                "tag",
                "value"
            ],
            // https://www.zabbix.com/documentation/current/manual/api/reference/item/get
            // "tags": [
            //     { "tag": tag, "value": "upload", "operator": "0" }, // operator: 0 - (default) Like; / 1 - Equal; 
            //     { "tag": tag, "value": "download", "operator": "0" } // operator: 0 - (default) Like; / 1 - Equal; 
            // ]
        },
        "id": 1,
        "auth": auth
    }

    const hosts = await zabbixRequest(body);

    return hosts?.data?.result;

}


const getTriggers = async (auth, hostsids = []) => {

    const body = {
        "jsonrpc": "2.0",
        "method": "trigger.get",
        "params": {
            "hostids": hostsids,
            "output": [
                "triggerid",
                "description",
                "priority",
                "lastchange",
                "host",
                "value",
                "manual_close",
                "state",
                "status"
            ],
            /*
                value: (readonly) Whether the trigger is in OK or problem state.
                Possible values are:
                0 - (default) OK;
                1 - problem. 

                status: Whether the trigger is enabled or disabled.
                Possible values are:
                0 - (default) enabled;
                1 - disabled. 
            */
            "filter": {
                "value": 1,
                "status": 0
            },
            "selectLastEvent": [
                "eventid"
            ],
            "selectHosts": [
                "hostid"
            ],
            "sortfield": "priority",
            "sortorder": "DESC",
            //"lastChangeSince": 1614556800
        },
        "id": 1,
        "auth": auth
    }

    const triggers = await zabbixRequest(body);

    triggers?.data?.result?.map((h, index) => {
        return _.forIn(h, function (value, key) {
            //console.log("key: ", key);
            //console.log("value: ", value);
            if (key === 'priority') {
                h[key] = parseInt(value, 10)
            }
        });
    })

    return triggers?.data?.result;

}

/**
 * 
 * @param {*} auth token autenticação
 * @param {*} itemsid ids dos item que devem ser buscados
 * @param {*} history tipo do histórico zabbix, 0 = unsigned int, 3 = float
 * @param {*} limit número limite de registros que devem ser buscados
 * @returns 
 */
const getHistory = async (auth, itemsid, historyType = 0, limit = 500) => {


    const now = new Date();
    // otem unix timestamp 6 horas atrás
    now.setHours(now.getHours() - 6);
    const time_from = now.getTime() / 1000;

    //console.log("getTime()", now.getTime() / 1000)
    //console.log('now: ', `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);

    const body = {
        "jsonrpc": "2.0",
        "method": "history.get",
        "params": {
            "output": "extend",
            "history": historyType,
            "itemids": itemsid,
            "sortfield": "clock",
            "sortorder": "DESC",
            "limit": limit, // aproximadamente 6h de metricas
            //"time_from": time_from
        },
        "id": 1,
        "auth": auth
    }

    //console.log('getHistory body: ', JSON.stringify(body, null, 4))

    const history = await zabbixRequest(body);

    if (historyType === 3) {
        // converte os valore para integer
        history?.data?.result?.map((h, index) => {
            return _.forIn(h, function (value, key) {
                //console.log("key: ", key);
                //console.log("value: ", value);
                // somente o itemid não deve ser convertido
                // if (!_.includes(['itemid'], key)) {
                //     h[key] = parseInt(value, 10)
                // }
                h[key] = parseInt(value, 10)
            });
        })
    }

    // converte os valore para float
    if (historyType === 0) {
        history?.data?.result?.map((h, index) => {
            return _.forIn(h, function (value, key) {
                //console.log("key: ", key);
                //console.log("value: ", value);
                // se a key for value, converte para float
                if (_.includes(['value'], key)) {
                    h[key] = parseFloat(value)
                }

                // converte os valores clock,ns para integer
                if (_.includes(['itemid', 'clock', 'ns'], key)) {
                    h[key] = parseInt(value, 10)
                }

            });
        })


    }


    return history?.data?.result

}


/**
 * `zabbix` service.
 */

module.exports = {
    // exampleService: (arg1, arg2) => {
    //   return isUserOnline(arg1, arg2);
    // }


    getGroupsOptions: async () => {

        const auth = await zabbixLogin();

        if (auth) {
            return await getGroupsOptions(auth)
        } else {
            console.log("erro de autenticação zabbix: ")
        }


    },

    getHostsOptions: async (groupid) => {

        const auth = await zabbixLogin();

        if (auth) {
            return await getHostsOptions(auth, groupid)
        } else {
            console.log("erro de autenticação zabbix: ")
        }


    },

    getItemsOptions: async (hostid) => {

        const auth = await zabbixLogin();

        if (auth) {
            return await getItemsOptions(auth, hostid)
        } else {
            console.log("erro de autenticação zabbix: ")
        }


    },



    generateMapGroups: async () => {

        try {

            const auth = await zabbixLogin();

            if (auth) {

                // filtra e obtem os grupos que tem o GROUPID cadastrado
                //const appGroups = confApp.mapGroups.filter(confGroup => {
                //    if (confGroup.groupid != undefined) {
                //        return confGroup
                //    }
                //})

                const appConf = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'AppConf', 'app.json'), 'utf8'));
                //console.log("appConf : ", appConf)

                const appGroups = appConf.confGroups;


                // seleciona os ids dos grupos que devem ser buscados no zabbix
                const appGroupsIds = []
                const historyItemsIds = []

                appGroups.map(appGroup => {

                    // verifica se o grupo possui informações de latitude e longitude
                    // if (!_.has(appGroup, 'latitude') || !_.has(appGroup, 'longitude')) {
                    //     //_.remove(groupsZabbix, (g) => g.groupid == group.groupid)
                    //     //return
                    //     //console.log('sem latitude/longitude: ', appGroup.groupid)
                    //     return
                    // }
                    historyItemsIds.push(appGroup.upload_itemid)
                    historyItemsIds.push(appGroup.download_itemid)
                    historyItemsIds.push(appGroup.ping_loss_itemid)
                    historyItemsIds.push(appGroup.ping_responsetime_itemid)

                    appGroupsIds.push(appGroup.groupid)

                })


                //console.log('appGroupsIds: ', appGroupsIds)
                //console.log('itemsid: ', historyItemsIds)




                // obtem os grupos no zabbix
                const zabbixGroups = await getGroups(auth, appGroupsIds);

                // obtem os hosts dos grupos
                const hostsids = await getHostsIds(zabbixGroups);
                //console.log(hostsids);

                const zabbixHosts = await getHosts(auth, hostsids);
                //const zabbixGraphItems = await getItems(auth, itemsid);
                const zabbixTriggers = await getTriggers(auth, hostsids);

                //const historyItemsIds = _.map(zabbixGraphItems, 'itemid');
                const historyBandwidth = await getHistory(auth, historyItemsIds, 3, 1001) // aproximadamente 6h de métricas
                const historyAvaliability = await getHistory(auth, historyItemsIds, 0, 1001) // aproximadamente 6h de métricas


                const mapGroups = await buildAssociations(
                    appGroups,
                    zabbixGroups,
                    zabbixHosts,
                    zabbixTriggers
                );


                // Início - salva dados aplicação #########################################################################################
                try {
                    const mapGroupsData = JSON.stringify(mapGroups, null, 4);
                    fs.writeFileSync('src/AppData/mapGroups.json', mapGroupsData);
                    console.log("mapGroups JSON salvo.");
                } catch (err) {
                    console.log(err);
                }

                try {

                    const historyData = JSON.stringify(_.concat(historyBandwidth, historyAvaliability), null, 4);
                    fs.writeFileSync('src/AppData/mapGroupsHistory.json', historyData);
                    console.log("mapGroupsHistory JSON salvo.");

                } catch (err) {
                    console.log(err);
                }

                // Fim - salva dados aplicação #########################################################################################


            } else {
                console.log("erro de autenticação zabbix: ")
            }


        } catch (error) {
            console.log("erro no generateMapGroups: ", error)
        }





    },

};
