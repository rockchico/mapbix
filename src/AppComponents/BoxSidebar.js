import { Box } from 'grommet';


const BoxSidebar = ({ children, background = 'dark-3', width = "large", pad='none'}) => {


    return (
        <Box
            gridArea="sidebar"
            background={background}
            width={width}
            animation={[
                { type: 'fadeIn', duration: 300 },
                { type: 'slideRight', size: 'xlarge', duration: 150 },
            ]}
            pad={pad}
            overflow={{ vertical: 'scroll' }}
            height={'100%'}
        >

            { children }

        </Box>
    )
}

export default BoxSidebar