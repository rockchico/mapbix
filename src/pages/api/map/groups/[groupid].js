const fs = require('fs');


export default async function handler(req, res) {

    const groupid = req.query['groupid']
    //console.log('api groupid = ', groupid);

    fs.readFile('src/AppData/mapGroups.json', 'utf-8', (err, data) => {
        if (err) {
            //throw err;
            res.status(500).json(['Não foi possível obter as informações.']);
            return
        }
    
        // parse JSON object
        const mapGroups = JSON.parse(data.toString());

        const group = mapGroups.find(g => g.groupid === parseInt(groupid, 10))
         
    
        // print JSON object
        //console.log(group);

        res.status(200).json(group)
        return
    });

}