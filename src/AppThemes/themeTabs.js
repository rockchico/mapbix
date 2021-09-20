import { grommet as grommetTheme } from "grommet/themes";
import { deepMerge } from "grommet/utils";
import { css } from 'styled-components';

import "@fontsource/roboto" // fonte Roboto https://fontsource.org/fonts/roboto

const theme = deepMerge(grommetTheme, {
    global: {
        
        edgeSize: {
            small: '10px',
        },
        
        
        elevation: {
            light: {
                small: '0px 1px 5px rgba(0, 0, 0, 0.50)',
                medium: '0px 3px 8px rgba(0, 0, 0, 0.50)',
            },
        },
        size: {
            avatar: "36px",
            sidebar: "60px"
        }
    },
    

    tab: {
        active: {
            background: 'dark-1',
            color: 'accent-1',
        },
        background: 'dark-3',
        border: undefined,
        color: 'white',
        hover: {
            background: 'dark-1',
        },
        margin: undefined,
        pad: {
            bottom: undefined,
            horizontal: 'xxsmall',
        },

        extend: ({ theme }) => css`
        border-radius: 4px;
        /* or 'border-radius: ${theme.global.control.border.radius}' */
        box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.5);
        /* or 'box-shadow: ${theme.global.elevation.light.small}' */`,
    },

    tabs: {
        background: 'dark-2',
        gap: 'medium',
        header: {
            background: 'dark-2',
            extend: ({ theme }) => css`
            padding: 10px;
            /* or 'padding: ${theme.global.edgeSize.small}' */
            box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.50);
            /* or 'box-shadow: ${theme.global.elevation.light.medium}' */`,
        },

        panel: {
            extend: ({ theme }) => css`
            padding: ${theme.global.edgeSize.xxsmall};
            /* or 'padding: ${theme.global.edgeSize.large}' */
            box-shadow:  0px 3px 8px rgba(0, 0, 0, 0.50);
            /* or 'box-shadow: ${theme.global.elevation.light.medium}' */`,
        },
    },

    

});

export default theme
