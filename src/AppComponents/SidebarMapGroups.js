
import { useState, useEffect, createRef, useCallback } from 'react'

import { Box, Button, Text, Accordion, AccordionPanel, Anchor } from 'grommet';


import GroupSearch from 'AppComponents/GroupSearch'
import BoxSidebar from 'AppComponents/BoxSidebar'
import SeverityStatus from 'AppComponents/SeverityStatus';

import { useMap } from 'AppHooks/map'

import MapGroupTabs from 'AppComponents/MapGroupTabs';
import LoadingSpinner from 'AppComponents/LoadingSpinner'



const MapGroupsSidebar = () => {


    const [elRefs, setElRefs] = useState([]);

    // #TODO: setar o tamanho do array dinamicamente de acorodo com o array de mapGroups
    const [arrLength, setArrLength] = useState(200);


    const {
        actions: mapActions,
        state: { mapGroups, activeIndex }
    } = useMap();


    useEffect(() => {

        // add or remove refs
        setElRefs(elRefs => (
            Array(arrLength).fill().map((_, i) => elRefs[i] || createRef())
        ));


    }, []);





    // se houver um activeIndex faz com scroll seja posicionado no mapGroup selecionado
    useEffect(() => {

        if (activeIndex) {
            elRefs[activeIndex]?.current.scrollIntoView();
        }

    }, [activeIndex]);





    if (mapGroups.isError) {
        return <BoxSidebar>
            <Text>Erro ao carregar grupos.</Text>
        </BoxSidebar>
    }

    if (mapGroups.isLoading) {
        return <BoxSidebar>
            <LoadingSpinner loadingMessage={"Carregando Grupos ..."} />
        </BoxSidebar>
    }





    return (

        <BoxSidebar width={'40vw'}> { /* 40% view width */}
            <Box
                pad='small'
                //alignSelf="start"
                //width="large"
                height={{ min: "xxsmall", max: "xxsmall" }}
            >
                <GroupSearch />
            </Box>

            <Box
                pad='small'
                pad={{ top: 'medium' }}

                //alignSelf="start"
                //width="large"
                height={{ min: "xxsmall", max: "xxsmall" }}

            >

                <Accordion animate={true} multiple={false} activeIndex={activeIndex}>

                    {mapGroups.data.map((mapGroup, i) => (

                        <AccordionPanel
                            ref={elRefs[i]}
                            //onClick={() => {
                            //    mapActions.goToWithInfo(mapGroup)
                            //}}
                            label={
                                <Box flex direction='row' pad='medium' gap='small' justify='start' align='center'>
                                    <SeverityStatus severity={mapGroup.maxPriority} />
                                    {/* <Text size='medium'>{mapGroup.info.nome} | {mapGroup.info.sigla} | {mapGroup.info.groupid}</Text> */}
                                    <Text size='medium'>{mapGroup.info.nome}</Text>
                                </Box>
                            }
                            key={mapGroup.groupid}
                            onFocus={() => { mapActions.goToWithInfo(mapGroup.groupid) }}
                        >

                            <Box background="light-1" overflow="auto" style={{ minHeight: '200px' }}>
                                <MapGroupTabs groupid={mapGroup.groupid} />
                            </Box>
                        </AccordionPanel>

                    ))}

                </Accordion>


            </Box>
        </BoxSidebar>
    )
}

export default MapGroupsSidebar