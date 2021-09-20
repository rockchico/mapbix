const Joi = require('joi');

/**
 * Create the validation message acording with type
 * @param {*} field Nome do campo que será exibido na mensagem 
 * @returns Formated message
 */
const m = (field) => (
    {
        "number.base": `${field} deve ser um número`,
        "number.empty": `${field} não poder vazio`,
        "string.empty": `${field} não poder vazio`,
        'any.required': `${field} é um campo requerido`,
        "any.invalid": `${field} é inválida`,
    }
)

/**
 * Validates latitude
 * @param {*} value 
 * @param {*} helpers 
 * @returns Joi error helper
 */
const isLatitude = (value, helpers) => {

    // Use error to return an existing error code
    if (!(isFinite(value) && Math.abs(value) <= 90)) {
        return helpers.error('any.invalid');
        //throw new Error('Latitude inválida');
    }

    return parseFloat(value);
}

/**
 * Validates longitude 
 * @param {*} value 
 * @param {*} helpers 
 * @returns 
 */
const isLongitude = (value, helpers) => {

    if (!(isFinite(value) && Math.abs(value) <= 180)) {
        //throw new Error('Longitude inválida');
        return helpers.error('any.invalid');
    }

    return parseFloat(value);
}

const schema = Joi.object({

    /*
    "id": "0_DXSZdMn",
    "groupid": 22,
    "main_hostid": 10451,
    "upload_itemid": 37639,
    "download_itemid": 37638,
    "ping_loss_itemid": 37668,
    "ping_responsetime_itemid": 37667,
    "sigla": "SAL",
    "latitude": "-12.964150",
    "longitude": "-38.505821"
    */

    //id: Joi.string(),
    groupid: Joi.number().required().messages(m("Grupo")),
    main_hostid: Joi.number().required().messages(m("Host principal")),
    upload_itemid: Joi.number().required().messages(m("Upload Item")),
    download_itemid: Joi.number().required().messages(m("Download Item")),
    ping_loss_itemid: Joi.number().required().messages(m("Item perda de pacotes")),
    ping_responsetime_itemid: Joi.number().required().messages(m("Item tempo de resposta")),
    sigla: Joi.string().required().messages(m("Sigla")),
    latitude: Joi.number().custom(isLatitude, 'err').messages(m("Latitude")),
    longitude: Joi.number().custom(isLongitude, 'err').messages(m("Longitude")),
})

export const validateConfGroup = (confGroup) => {
    const result = schema.validate(confGroup, { abortEarly: false })

    const errorMessage = {};

    if (result.error) {
        for (const err of result.error.details) {
            errorMessage[err.context.key] = err.message
        }
    }

    return { result, errorMessage }
}