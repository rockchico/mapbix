import { Box, Spinner, Text } from 'grommet';
//import { Notification, Analytics, Chat, Clock, Configure, Help, Projects, Split, StatusInfoSmall, ZoomIn, ZoomOut, Map as MapPoint } from 'grommet-icons';


const LoadingSpinner = ({ size = "medium", color = 1, loadingMessage = 'Carregando ... '}) => {


    return (
        <Box align="center" direction="row" gap="small" pad="small">
            <Spinner color={`graph-${color}`} size={size} />
            <Text size={size}>{loadingMessage}</Text>
        </Box>
    )
}

export default LoadingSpinner