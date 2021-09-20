
import { Box, Button, Collapsible, Heading, Grommet, Text, Avatar, Nav, Stack, Sidebar } from 'grommet';
import { Notification, Analytics, Chat, Clock, Configure, Help, Projects, Split, StatusInfoSmall, ZoomIn, ZoomOut, Map as MapPoint } from 'grommet-icons';


const StatusErrorMessage = ({ children, ok = false, error = false }) => {

    const background = (ok ? 'status-ok' : 'status-error');

    return (
        <Box border gap="medium" pad="medium" width="large" background={background} align='center'>
            <Text size='medium'>
                {children}
            </Text>
        </Box>
    )
}

export default StatusErrorMessage