import { StyleSheet, ScrollView, Image, View, Text } from "react-native"
import OutlinedButton from "../UI/OutlinedButton"
import { Colors } from "../constants/colors"
import { useEffect, useState } from "react"
import { fetchPlaceDetails } from "../util/database"

const PlaceDetails = ({route, navigation}) => {
    const [fetchedPlace, setFetchedPlace] = useState()
    const showOnMapHandler = () => {
        navigation.navigate('Map', {
            latitude: fetchedPlace.lat,
            longitude: fetchedPlace.lng
        })
    }

    const selectedPlaceId = route.params.placeId

    useEffect(() => {
        const loadPlaceData = async() => {
            const place = await fetchPlaceDetails(selectedPlaceId)
            setFetchedPlace(place)
            navigation.setOptions({
                title: place.title,
            })
        }
        loadPlaceData()
    }, [selectedPlaceId])

    if (!fetchedPlace) {
        return <View style={styles.fallback}><Text>Loading Place Data...</Text></View>
    }

    return (
        <ScrollView>
            <Image style={styles.image} source={{uri: fetchedPlace.imageUri}}/>
            <View style={styles.locationContainer}>
                <View style={styles.addressContainer}>
                    <Text style={styles.address}>{fetchedPlace.address}</Text>
                </View>
                <OutlinedButton icon='map' onPress={showOnMapHandler}>View on Map</OutlinedButton>
            </View>
        </ScrollView>
    )
}

export default PlaceDetails

const styles = StyleSheet.create({
    fallback: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    screen: {
        alignItems: 'center'
    },
    image: {
        height: '35%',
        minHeight: 300,
        width: '100%'
    },
    locationContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    addressContainer: {
        padding: 20,
    },
    address: {
        color: Colors.primary500,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    }
})