const cron = require('node-cron');

const zabbix = require('./zabbix')


module.exports = {

    init: async () => {


        // quando a aplicação estiver pronta, coleta as informações do zabbix
        await zabbix.generateMapGroups();


        // Agenda a tarefa de geração da coleta de dados da API Zabbix
        /*
        * * * * * *
        | | | | | |
        | | | | | day of week
        | | | | month
        | | | day of month
        | | hour
        | minute
        second ( optional )
        */
        cron.schedule('*/59 * * * * *', async () => { // a cada 30sec
            //cron.schedule('1-59 * * * *', async () => { // de 1 em 1 min , no segundo 0

            let now = new Date();

            console.log('start task - ', `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);

            await zabbix.generateMapGroups();

            now = new Date();
            console.log('end task - ', `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);

        }, {
            scheduled: true,
            timezone: "America/Sao_Paulo"
        });



    }

};