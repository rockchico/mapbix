import { useEffect, useState } from 'react';


import { Box, Tabs, Tab, Text, DataTable, Meter } from 'grommet';

import {

    Grommet,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHeader,
    TableRow
} from 'grommet';



import SeverityStatus from 'AppComponents/SeverityStatus';
import { timeConverter } from 'AppUtils/index'
import { useMapGroup } from 'AppHooks/Data/useMapGroup';


const columns = [
    {
        property: 'triggerid',
        header: 'Trigger',
        primary: true,
        align: 'center',
        render: datum => <Text style={{ fontWeight: 'bold' }}>{datum.triggerid}</Text>,
    },
    {
        property: 'host',
        header: 'Host',
        align: 'center',
        render: datum => datum.host,
    },
    {
        property: 'description',
        header: 'Descrição',
        align: 'center',
        render: datum => datum.description,
    },
    {
        property: 'lastchange',
        header: 'Início',
        align: 'end',
        render: datum => datum.lastchange && timeConverter(datum.lastchange),
    },
    {
        property: 'priority',
        header: 'Severidade',
        align: "center",
        render: datum => (
            <Box pad={{ vertical: 'xsmall' }} align='center'>
                <SeverityStatus severity={datum.priority} />
            </Box>
        ),
    },
    {
        property: 'acknowledged',
        header: 'Reconhecido',
        align: "center",
        render: datum => datum.acknowledged === "0" ? "Sim" : "Não",
    },
];








const MapGroupTabStatus = ({ groupid }) => {

    const mapGroup = useMapGroup(groupid)

    let triggers = [];
    let triggerIndex = 0;

    mapGroup.data.hosts.map((row_h, index_h) => {

        row_h.triggers.map((row_t) => {

            triggers[triggerIndex] = {
                triggerid: row_t.triggerid,
                host: row_h.name,
                description: row_t.description,
                lastchange: row_t.lastchange,
                priority: parseInt(row_t.priority, 10),
                acknowledged: row_t.lastEvent.acknowledged
            }

            triggerIndex++;

        })

    })


    if (triggers.length === 0) {

        return <Box align="center" pad='small' gap='medium' height='100%' background='white'>
            <Text>No momento não há problemas para este grupo.</Text>
        </Box>
    }

    return (
        <Grommet fill>

            <Box align="start" pad="xxsmall" overflow={{ horizontal: 'scroll', vertical: 'none' }}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((c, i) => (
                                <TableCell key={i} scope="col" align={c.align} style={{ fontWeight: 'bold' }} border={{ side: 'bottom', color: 'accent-1', size: 'xsmall' }}>
                                    <Text>{c.header}</Text>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {triggers.map(datum => (
                            <TableRow key={datum.id}>

                                {columns.map(c => (
                                    <TableCell key={c.property} scope="col" align={c.align} style={{ fontSize: '0.8em' }} border={{ side: 'bottom', color: 'accent-1', size: 'xsmall' }}>
                                        {c.render(datum)}
                                    </TableCell>
                                ))}

                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </Box>
        </Grommet>
    )
};

export default MapGroupTabStatus