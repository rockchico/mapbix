import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grommet, DataTable, Meter, Text, Button } from 'grommet';
import { Edit, Trash, AddCircle } from 'grommet-icons';
import { useNavigate } from 'react-router-dom';

import ButtonTip from 'AppComponents/ButtonTip';
import LoadingSpinner from 'AppComponents/LoadingSpinner'
import { useConfGroups } from 'AppHooks/Data/useConfGroups'
import StatusErrorMessage from './StatusErrorMessage';
import { useSession } from 'next-auth/client'



const TableActions = ({ groupid }) => {

    const navigate = useNavigate();


    return (
        <Box direction='row'>
            <Button
                onClick={() => navigate(`/conf-groups/update/${groupid}`)}
                icon={<Edit size='medium' />}
                tip={{ plain: true, content: (<ButtonTip>Editar</ButtonTip>) }}
            />

            <Button
                onClick={() => navigate(`/conf-groups/delete/${groupid}`)}
                icon={<Trash size='medium' />}
                tip={{ plain: true, content: (<ButtonTip>Excluir</ButtonTip>) }}
            />
        </Box>
    )

}




const columns = [
    {
        property: 'groupid',
        header: 'Grupo',
        primary: true
    },
    // {
    //     property: 'nome',
    //     header: 'Nome',
    // },
    {
        property: 'sigla',
        header: 'Sigla',
    },
    // {
    //     property: 'date',
    //     header: 'Date',
    //     render: (datum) =>
    //         datum.date && new Date(datum.date).toLocaleDateString('en-US'),
    //     align: 'end',
    // },
    // {
    //     property: 'percent',
    //     header: 'Percent Complete',
    //     render: (datum) => (
    //         <Box pad={{ vertical: 'xsmall' }}>
    //             <Meter
    //                 values={[{ value: datum.percent }]}
    //                 thickness="small"
    //                 size="small"
    //             />
    //         </Box>
    //     ),
    // },

    {
        property: 'actions',
        header: '',
        render: (datum) => {
            return <TableActions groupid={datum.groupid} />
        },
    },

];




export const ConfGroupTable = () => {

    const [session, loading] = useSession()



    //const [select, setSelect] = React.useState([]);
    const [data, setData] = useState([]);
    const confGroups = useConfGroups();
    const navigate = useNavigate();

    useEffect(() => {

        if (confGroups.isSuccess) {
            setData(confGroups.data)
        }
    }, [confGroups.isSuccess]); // Efeito roda somente se confGroups.isSuccess mudar

    const onSearch = useCallback((search) => {

        let nextData;

        if (search) {

            // The function below escapes regular expression special characters: // [ \ ^ $ . | ? * + ( )

            const escapedText = (text) => text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

            const expressions = Object.keys(search).map((property) => ({
                property,
                // Create the regular expression with modified value which handles
                // escaping special characters. Without escaping special characters,
                // errors will appear in the console
                exp: new RegExp(escapedText(search[property]), 'i'),
            }));

            nextData = confGroups.data.filter(
                (d) => !expressions.some((e) => !e.exp.test(d[e.property])),
            );

        } else {
            nextData = confGroups.data;
        }

        setData(nextData);

    }, [confGroups.data])


    if (!session) {
        return (
            <StatusErrorMessage error>
                <pre>Acesso negado.</pre>
            </StatusErrorMessage>
        )
    }




    if (confGroups.isError) {
        return (
            !_.isEmpty(confGroups.error.response.data) ? (

                <StatusErrorMessage error>
                    <pre>
                        {"".concat(...confGroups.error.response.data)}
                    </pre>
                </StatusErrorMessage>

            ) : null
        )
    }

    if (confGroups.isLoading) {
        return <LoadingSpinner loadingMessage={`Carregando grupos ... `} />
    }



    return (

        <Grommet full>
            <Box pad="large">
                <Box direction='row'>
                    <Button
                        onClick={() => navigate(`/conf-groups/create`)}
                        icon={<AddCircle size='medium' />}
                        label={"Adicionar Grupo"}
                    />
                </Box>
                <DataTable
                    //columns={columns}
                    //data={confGroups.data}
                    //onSelect={setSelect}
                    //select={select}
                    sortable
                    step={8}
                    paginate

                    columns={columns.map((column) => ({
                        ...column,
                        search: column.property === 'nome' || column.property === 'sigla',
                    }))}
                    data={data}
                    onSearch={onSearch}

                />
            </Box>
        </Grommet>

    );

};