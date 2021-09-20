import React from 'react';

import _ from 'lodash'
import {
    Box,
    Button,
    Text
} from 'grommet';

import { useNavigate, useParams } from 'react-router-dom';
import { useSession } from 'next-auth/client'

import LoadingSpinner from 'AppComponents/LoadingSpinner'
import { useConfGroup } from 'AppHooks/Data/useConfGroup'
import StatusErrorMessage from 'AppComponents/StatusErrorMessage';
import { useConfGroupDelete } from 'AppHooks/Data/useConfGroupDelete';



export const ConfGroupFormDelete = () => {

    const { groupid } = useParams()
    const confGroup = useConfGroup(groupid);
    const confGroupDelete = useConfGroupDelete();
    const navigate = useNavigate();
    const [session, loading] = useSession();


    //if (loading) { return <p>Loading...</p> }
    if (!session) {
        return (
            <StatusErrorMessage error>
                <pre>Acesso negado.</pre>
            </StatusErrorMessage>
        )
    }

    if (confGroup.isError) {
        return (
            !_.isEmpty(confGroup.error?.response?.data) ? (
                <StatusErrorMessage error>
                    <pre>{"".concat(...confGroup.error.response.data)}</pre>
                </StatusErrorMessage>
            ) : null
        )
    }

    if (confGroup.isLoading) {
        return <LoadingSpinner loadingMessage={`Carregando grupo ... `} />
    }

    if (confGroupDelete.isSuccess) {
        return (
            <StatusErrorMessage ok>
                <pre>Grupo excluído com sucesso</pre>
            </StatusErrorMessage>
        )
    }

    return (
        <>
            <Text size='large'>Você deseja excluir o grupo {groupid}?</Text>
            <Box direction="row" justify="between" margin={{ top: 'medium' }} gap="medium">
                <Button label="Cancelar" onClick={() => navigate(`/conf-groups/`)} />
                <Button label={"Sim"} onClick={() => confGroupDelete.mutate(groupid)} primary />
            </Box>

        </>
    )
}