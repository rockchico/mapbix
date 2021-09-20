const { getSession } = require('next-auth/client')
import shortid from 'shortid'
import db from 'AppServices/db'
import { validateConfGroup } from 'AppUtils/validations'
import _ from 'lodash'


//
const failureRate = 0

export default async (req, res) => {

    const session = await getSession({ req })

    if (!session) {
        res.status(401)
        res.json(["Operação não permitida. Por favor efetue login."])
        return
    }

    try {
        if (req.method === 'GET') {
            return await GET(req, res)
        } else if (req.method === 'POST') {
            return await POST(req, res)
        }



    } catch (err) {
        console.error(err)
        res.status(500)
        res.json(['Um erro inesperado aconteceu.'])
    }
}

async function GET(req, res) {
    const {
        query: { pageOffset, pageSize },
    } = req

    const confGroups = (await db.get()).confGroups.map((d) => ({
        ...d
    }))

    if (Number(pageSize)) {
        const start = Number(pageSize) * Number(pageOffset)
        const end = start + Number(pageSize)
        const page = confGroups.slice(start, end)

        return res.json({
            items: page,
            nextPageOffset: confGroups.length > end ? Number(pageOffset) + 1 : undefined,
        })
    }

    res.status(200)
    res.json(confGroups)
}

async function POST(req, res) {

    const {
        body: { groupid },
    } = req


    if (Math.random() < failureRate) {
        res.status(500)
        res.json(['Um erro inesperado aconteceu.'])
        return
    }

    // verifica se já existe registro com o mesmo groupid
    const row = (await db.get()).confGroups.find((d) => d.groupid == groupid)

    if (row) {
        res.status(400)
        res.json({ groupid: "Um registro como mesmo grupo já existe." })
        return
    }
    // ----------------------
    // Validação
    const validation = validateConfGroup(req.body)

    //console.log(JSON.stringify(validation, null, 4))

    // Se errorMessage não estiver vazio significa que houve problema de validação
    if (!_.isEmpty(validation.errorMessage)) {
        res.status(400)
        res.json(validation.errorMessage)
        return
    }

    // ----------------------

    const newRow = {
        id: shortid.generate(),
        ...validation.result.value,
    }

    await db.set((old) => {
        return {
            ...old,
            confGroups: [...old.confGroups, newRow],
        }
    })

    res.status(200)
    res.json(newRow)
}
