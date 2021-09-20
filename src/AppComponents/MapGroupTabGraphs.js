import React, { memo, useState } from "react";
import _ from "lodash";

import { Box, Text } from 'grommet';


import BandwithChart from 'AppComponents/BandwithChart';
import ResponseLossChart from 'AppComponents/ResponseLossChart';
import LoadingSpinner from 'AppComponents/LoadingSpinner'

import { useMapGroupHistory } from "AppHooks/Data/useMapGroupHistory";
import { useMapGroup } from 'AppHooks/Data/useMapGroup';


const BoxTabGraphs = ({ children }) => {
    return (
        <Box align="center" pad='small' gap='medium' height='100%' background='white'>
            {children}
        </Box>
    )
}


const MapGroupTabGraphs = ({ groupid }) => {


    const mapGroupHistory = useMapGroupHistory(groupid)
    const mapGroup = useMapGroup(groupid)


    if (mapGroupHistory.isError || mapGroup.isError) {
        return <BoxTabGraphs>
            <Text>Erro ao carregar informações do histórico.</Text>
        </BoxTabGraphs>
    }

    if (mapGroupHistory.isLoading || mapGroup.isLoading) {

        return <BoxTabGraphs>
            <LoadingSpinner loadingMessage={`Carregando histórico do grupo ${groupid} ... `} />
        </BoxTabGraphs>
    }

    if (mapGroupHistory.isSuccess || mapGroup.isSuccess) {

        if (_.isEmpty(mapGroup?.data?.graphs)) {
            return <BoxTabGraphs>
                <Text>Não foi encontrado gráficos do grupo {groupid}</Text>
            </BoxTabGraphs>
        }

        if (_.isEmpty(mapGroupHistory.data)) {
            return <BoxTabGraphs>
                <Text>Não foi encontrado histórico do grupo {groupid}</Text>
            </BoxTabGraphs>
        }
    }






    return (
        <BoxTabGraphs>


            <BandwithChart
                key={'1'}
                historyData={mapGroupHistory.data}
                title={`GRÁFICO BANDA`}
                downloadColor='#199C0D'
                uploadColor='#F63100'
                downloadItem={mapGroup.data.info.download_itemid}
                uploadItem={mapGroup.data.info.upload_itemid}
            />

            <ResponseLossChart
                key={'2'}
                historyData={mapGroupHistory.data}
                title={`GRÁFICO DISPONIBILIDADE`}
                responseItem={mapGroup.data.info.ping_responsetime_itemid}
                lossItem={mapGroup.data.info.ping_loss_itemid}
            />

        </BoxTabGraphs>
    )
};


// se as propriedades forem iguais retorna true, indicando que o componente não precisa ser renderizado novamente
// quando retornar false, indica que as propriedades são diferentes, necessitando assim nova renderização

function propsAreEqual(prevProps, nextProps) {

    const areEqual = prevProps.groupid === nextProps.groupid

    return areEqual;
}

const MemoizedMapGroupTabGraphs = React.memo(MapGroupTabGraphs, propsAreEqual)

export default MemoizedMapGroupTabGraphs;
//export default MapGroupTabGraphs;