const fs = require('fs');

export default async function handler(req, res) {

    fs.readFile('src/AppData/mapGroups.json', 'utf-8', (err, data) => {
        
        if (err) {
            //throw err;
            res.status(500).json(['Não foi possível obter as informações.']);
            return
        }
    
        // parse JSON object
        const mapGroups = JSON.parse(data.toString());

        res.status(200).json(mapGroups)
        return
    });


}