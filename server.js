/**
 * - Custom Server
 *  https://github.com/vercel/next.js/tree/canary/examples/custom-server-express
 * 
 * - Node Cron
 *  https://www.digitalocean.com/community/tutorials/nodejs-cron-jobs-by-examples
 *  https://www.npmjs.com/package/node-cron
 */


const fs = require("fs"); // Or `import fs from "fs";` with ESM

const envFile = process.env.NODE_ENV === "development" ? ".env.development" : ".env.production"
if (!fs.existsSync(envFile)) {
    // não encontrou o arquivo de configuração
    throw Error(`Arquivo de configuração ${envFile} não econtrado.`)
}


// configuração .env dev ou prod
require('dotenv').config({
    path: envFile
})

const express = require('express')
const next = require('next')
const appCron = require('./src/AppServices/appCron')


const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare().then(() => {
    const server = express()

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, async (err) => {
        if (err) throw err

        // inicia o agendamento da coleta das informações API Zabbix
        await appCron.init()

        //console.log(`> App Ready on http://localhost:${port}`)
        console.log(`> Mapbix is Ready on ${port}`)
    })
})