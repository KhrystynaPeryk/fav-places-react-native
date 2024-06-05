import { useState, useLayoutEffect, useCallback } from "react";
import { StyleSheet, Alert } from "react-native"
import MapView, { Marker } from "react-native-maps";
import IconButton from "../UI/IconButton";

const Map = ({navigation, route}) => {
    const initialLocation = route.params && {latitude: route.params.latitude, longitude: route.params.longitude} 

    const [selectedLocation, setSelectedLocation] = useState(initialLocation)

    const region = {
        latitude: initialLocation ? initialLocation.latitude : 37.78,
        longitude: initialLocation ? initialLocation.longitude :  -122.43,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }

    const selectLocationHandler = (event) => {
        const lat = event.nativeEvent.coordinate.latitude
        const lng = event.nativeEvent.coordinate.longitude

        setSelectedLocation({latitude: lat, longitude: lng})
    }

    // wrapping the func into useCallback hook to avoid potential rerendering and infinite loops
    const savedPickedLocationHandler = useCallback(() => {
        if (!selectedLocation) {
            Alert.alert('No location picked!', 'You have to pick a location by tapping on the map first.')
            return
        }

        navigation.navigate('AddPlace', {
            pickedLat: selectedLocation.latitude,
            pickedLng: selectedLocation.longitude
        })
    }, [navigation,selectedLocation])
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: ({tintColor}) => <IconButton icon='save' size={24} color={tintColor} onPress={savedPickedLocationHandler} />
        })
        // since we are passing a function here in dependencies, we need to use useCallback hook to avoid potential rerender, infinite loops
    }, [navigation, savedPickedLocationHandler])

    return (
        <MapView 
            style={styles.map} 
            initialRegion={region}
            onPress={selectLocationHandler}
        >
            {
                selectedLocation && <Marker title="Picked Location" coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }} />
            }
        </MapView>
    )
}

export default Map

const styles = StyleSheet.create({
    map: {
        flex: 1, // map will take all the available space
    }
})