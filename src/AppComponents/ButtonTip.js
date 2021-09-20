import { Box, Tip, Text } from 'grommet';

const ButtonTip = ({ children }) => {

    return (

        <Box
            pad="xsmall"
            elevation="small"
            background="#EDEDED" // no opacity
            round="xsmall"
            margin="xsmall"
            overflow="hidden"
            align="center"
        >
            {children}
        </Box>
    )
}

export default ButtonTip