import { CircleInformation } from 'grommet-icons';
import { Box, Grommet, Tab, Tabs, Text } from 'grommet';
import MapGroupTabStatus from 'AppComponents/MapGroupTabStatus';
import MapGroupTabInfo from 'AppComponents/MapGroupTabInfo';
import MapGroupTabGraphs from 'AppComponents/MapGroupTabGraphs';
import LoadingSpinner from 'AppComponents/LoadingSpinner'

import themeTabs from 'AppThemes/themeTabs'
import { useMapGroup } from 'AppHooks/Data/useMapGroup';


const RichTabTitle = ({ icon, label }) => (

    <Box direction="row" align="center" pad="xsmall" margin="xxsmall">
        { /* icon */}
        <Text size="small">
            <strong>{label}</strong>
        </Text>
    </Box>

);

const MapGroupTabs = ({ groupid }) => {

    
    const mapGroup = useMapGroup(groupid)

    if(mapGroup.isError) {
        return  <Box align="center" pad='small' gap='medium' height='100%' background='white'>
                    <Text>Não foi possível carregar informações do grupo.</Text>
                </Box>
    }

    if(mapGroup.isLoading) {
        return  <BoxTabGraphs>
                    <LoadingSpinner loadingMessage={`Carregando informações do grupo... `} />
                </BoxTabGraphs>
    }
    
    
    return (

        <Grommet theme={themeTabs}>
    
            <Tabs>
                <Tab title={<RichTabTitle icon={<CircleInformation color="accent-1" />} label="Status" />} >
                    <MapGroupTabStatus groupid={groupid} />
                </Tab>
    
                <Tab title={<RichTabTitle icon={<CircleInformation color="accent-1" />} label="Gráficos" />} >
                    <MapGroupTabGraphs groupid={groupid} />
                </Tab>
    
                <Tab title={<RichTabTitle icon={<CircleInformation color="accent-1" />} label="Informações" />} >
                    <MapGroupTabInfo groupid={groupid} />
                </Tab>
    
    
            </Tabs>
        </Grommet>
    );

}

export default MapGroupTabs