import { useState } from 'react';
import { Box, Button, TextInput, FormField, Form } from 'grommet';
import { Search } from 'grommet-icons';

import { useMap } from 'AppHooks/map'

const GroupSearch = () => {

    const {
        actions: mapActions,
        state: { searchMapGroups }
    } = useMap();

    

    //const [value, setValue] = useState('');

    const onChange = event => {
        //setValue(event.target.value)
        mapActions.setSearchMapGroups(event.target.value)
    };

    return (
        <TextInput
            value={searchMapGroups}
            onChange={onChange}
            id="pesquisar"
            name="enabled"
            icon={<Search />} reverse placeholder="Pesquisar ..."
        />
    )
}

export default GroupSearch