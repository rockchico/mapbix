const { getSession } = require('next-auth/client')
import db from 'AppServices/db'
import { validateConfGroup } from 'AppUtils/validations'
import _ from 'lodash'

const deleteFailureRate = 0

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
        } else if (req.method === 'PATCH') {
            return await PATCH(req, res)
        } else if (req.method === 'DELETE') {
            return await DELETE(req, res)
        }

    } catch (err) {
        console.error(err)
        res.status(500)
        res.json(['Um erro inesperado aconteceu.'])
        return
    }
}

async function GET(req, res) {

    const groupid = parseInt(req.query['groupid'], 10)

    const row = (await db.get()).confGroups.find((d) => d.groupid == groupid)

    if (!row) {
        res.status(404)
        res.json(["Registro não encontrado"])
        return
    }

    res.json(row)
}

async function PATCH(req, res) {
    const {
        query: { groupid },
        body,
    } = req

    const row = (await db.get()).confGroups.find((d) => d.groupid == groupid)

    if (!row) {
        res.status(404)
        res.json(["Registro não encontrado"])
        return
    }

    // não precisa validar o id
    delete body.id

    // Validação -------------------------------------
    const validation = validateConfGroup(req.body)

    //console.log(JSON.stringify(validation, null, 4))

    // Se errorMessage não estiver vazio significa que houve problema de validação
    if (!_.isEmpty(validation.errorMessage)) {
        res.status(400)
        res.json(validation.errorMessage)
        return
    }
    // ----------------------------------------------

    delete body.groupid

    const newRow = {
        ...row,
        ...validation.result.value,
    }

    await db.set((old) => {
        return {
            ...old,
            confGroups: old.confGroups.map((d) => (d.groupid == groupid ? newRow : d)),
        }
    })

    res.json(newRow)
}

async function DELETE(req, res) {
    // const {
    //   query: { groupid },
    // } = req

    const groupid = parseInt(req.query['groupid'], 10)


    if (Math.random() < deleteFailureRate) {
        res.status(500)
        res.json(['Um erro inesperado aconteceu.'])
        return
    }

    const row = (await db.get()).confGroups.find((d) => {

        //console.log("d.groupid: ", d.groupid)
        //console.log("groupid: ", groupid)

        return d.groupid == groupid
    })

    if (!row) {
        res.status(404)
        res.json(["Registro não encontrado"])
        return
    }

    await db.set((old) => {
        return {
            ...old,
            confGroups: old.confGroups.filter((d) => d.groupid != groupid),
        }
    })

    res.status(200)
    res.json(["Registro excluído com sucesso."])
    return
}
