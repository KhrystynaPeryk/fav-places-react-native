import { StyleSheet, View, Alert, Text, ActivityIndicator} from "react-native"
import OutlinedButton from "../../UI/OutlinedButton"
import { Colors } from "../../constants/colors"
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from "expo-location"; // useForegroundPermissions is used to ask for permissions on both platforms
import { useEffect, useState } from "react"
// useFocus - using this hook triggers a re-render for the component when the screen it's in changes focus
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native"; //useRoute allows to get hold of data passed from another screen to this screen
// In Udemy, Google Maps API was used - I used an alternative below, coz it does not require a credit card
import MapView, { Marker } from "react-native-maps";
// used Nominatim instead of Google API to get an address out of lat and lng
import { getAddress } from "../../util/address";

const LocationPicker = ({onPickLocation}) => {
    const navigation = useNavigation()
    const route = useRoute()
    const isFocused = useIsFocused()
    const [location, setLocation] = useState(null);
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions()
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isFocused && route.params) {
            const mapPickedLocation = {latitude: route.params.pickedLat, longitude: route.params.pickedLng} 
            setLocation(mapPickedLocation)
        }
    }, [route, isFocused]);

    useEffect(() => {
        const handleLocation = async() => {
            if (location) {
                const address = await getAddress(location.latitude, location.longitude)
                onPickLocation({...location, address: address})
                console.log('FROM LOCATION PICKER: ', {...location, address: address})
                setIsLoading(false);
            }
        }
        handleLocation()
        // if you add a function to a dependency in useEffect, you need to wrap the function declaration into useCallback to avoid infinite loops
    }, [location, onPickLocation]);


    const verifyPermissions = async () => {  // for both iOS and Android - returns true or false depending whether we've got the permissions or not

        if (!locationPermissionInformation) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }
        
        if (locationPermissionInformation.status === PermissionStatus.DENIED && locationPermissionInformation.canAskAgain) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted; //returns true
        }

        if (locationPermissionInformation.status === PermissionStatus.DENIED) { // user denies permission
            Alert.alert('Insufficient Permissions!', 'You need to grant location permissions to use this app')
            return false
        }

        return true
    }

    const getLocationHandler = async() => {
        const hasPermission = await verifyPermissions()

        if (!hasPermission) {
            return
        }
        setIsLoading(true);
        const location = await getCurrentPositionAsync()
        setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
    }

    const pickOnMapHandler = () => {
        navigation.navigate('Map', {location} ? location : null)
    }

    let locationPreview = <View style={styles.noLocation}><Text>No location chosen yet!</Text></View>

    if (location) {
        locationPreview = (
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker coordinate={location} />
            </MapView>
        )
    }

    return (
        <View>
            <View style={styles.mapPreview}>
            {isLoading ? <ActivityIndicator size="large" color={Colors.primary500} /> : locationPreview}
            </View>
            <View style={styles.actions}>
                <OutlinedButton icon="location" onPress={getLocationHandler}>Locate User</OutlinedButton>
                <OutlinedButton icon="map" onPress={pickOnMapHandler}>Pick on Map</OutlinedButton>
            </View>
        </View>
    )
}

export default LocationPicker

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 4
    },
    noLocation: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})