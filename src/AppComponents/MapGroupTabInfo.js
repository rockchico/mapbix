import { useEffect, useState } from 'react';
import _ from "lodash";


import { CopyToClipboard } from "react-copy-to-clipboard";
import AsciiTable from 'ascii-table'

import { Box, Tabs, Tab, Text, DataTable, Button, List } from 'grommet';
import { Copy } from 'grommet-icons';
import { grommet } from 'grommet/themes';
import { useMapGroup } from 'AppHooks/Data/useMapGroup';
import CopyToClipboardButton from './CopyToClipboardButton';


const MapGroupTabInfo = ({ groupid }) => {

    const mapGroup = useMapGroup(groupid)

    const [isCopied, setIsCopied] = useState(false);

    var table = new AsciiTable(`Informações ${mapGroup.data.info.nome}`)
    //table.align(AsciiTable.LEFT, 'hey', 7)
    //table.removeBorder();
    
    //table.setHeading('Prop', 'Value');

    // retorna objeto sem a chave zabbix
    // as informações contidas na chave zabbix são utilizadas apenas para exibição dos gráficos
    const info = _.omit(mapGroup.data.info, ['zabbix']) 

    const properties = _.map(info, (value, prop) => {

        const p = prop.toUpperCase()
        table.addRow( p, value )

        return { prop: p, value}
    });

    //console.log("properties: ", properties)



    const codeSnippet = `<pre>${table.render()}</pre>`;

    const onCopyText = () => {
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    };


    const CopyButton = ({ label }) => (
        <Button 
            primary 
            label={label}
            icon={<Copy />} 
        />
    )


    return (
        <Box align="start" pad='medium' height='100%' gap='medium'>
            
            <CopyToClipboardButton textToCopy={codeSnippet} />
            
            <List
                margin='xsmall'
                pad='xsmall'
                data={properties}
                primaryKey="prop"
                secondaryKey="value"
            />

            

        </Box>
    )
};

export default MapGroupTabInfo