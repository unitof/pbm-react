import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' 
import { 
    ScrollView, 
    StyleSheet, 
    TouchableOpacity, 
    View, 
} from 'react-native'
import { SearchBar, ThemeContext } from 'react-native-elements'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FlatList } from 'react-native-gesture-handler'
import { 
    HeaderBackButton,
    Screen,
    Text,
} from '../components'

const FindLocationType = ({ navigation, locations: { locationTypes = [] } }) => {
    const theme = useContext(ThemeContext)
    const s = getStyles(theme)
    
    const allLocationTypes = [{name: navigation.getParam('type') === 'search' ? 'N/A' : 'All', id: -1 }, ...locationTypes]
    const [selectedLocationTypes, setLocationTypes] = useState(allLocationTypes)
    const [query, setQuery] = useState('')

    const handleSearch = (search = '') => { 
        const formattedQuery = search.toLowerCase()
        const selectedLocationTypes = allLocationTypes.filter(o => o.name.toLowerCase().includes(formattedQuery))
        setQuery(search)
        setLocationTypes(selectedLocationTypes)
    }

    const _selectLocationType = id => {
        navigation.getParam('setSelected')(id)
        navigation.goBack()
    }

    const renderRow = (locationType) => (
        <TouchableOpacity                           
            onPress={() => _selectLocationType(locationType.item.id)}
        >
            <View style={{padding:8}}>
                <Text style={{fontSize:18}}>{locationType.item.name}</Text>
            </View>    
        </TouchableOpacity>
    )

    const _keyExtractor = locationType => `${locationType.id}`
       
    return (
        <Screen>
            <SearchBar
                lightTheme
                placeholder='Filter location types...'
                platform='default'
                searchIcon={<MaterialIcons name='search' size={25} color="#97a5af" />}
                clearIcon={<MaterialCommunityIcons name='close-circle' size={20} color="#97a5af" onPress={handleSearch} />}
                onChangeText={handleSearch}
                inputStyle={{color:'#000e18'}}
                value={query}
                inputContainerStyle={s.filterInput}
                containerStyle={{backgroundColor:'#f5fbff'}}
            />
            <ScrollView keyboardDismissMode="on-drag">
                <FlatList
                    data={selectedLocationTypes}
                    renderItem={renderRow}
                    keyExtractor={_keyExtractor}
                />
            </ScrollView>
        </Screen>)
}

FindLocationType.navigationOptions = ({ navigation }) => {
    return {
        headerLeft: <HeaderBackButton navigation={navigation} />,
        title: 'Select Location Type'
    }
}

const getStyles = theme => StyleSheet.create({
    filterInput: {
        height:35,
        backgroundColor:'#e0ebf2',
        borderRadius:10,
        borderColor: '#d1dfe8',
        borderWidth:1
    },
})

FindLocationType.propTypes = {
    locationTypes: PropTypes.object,
    locations: PropTypes.object,
    navigation: PropTypes.object,
}

const mapStateToProps = ({ locations }) => ({ locations })
export default connect(mapStateToProps, null)(FindLocationType)