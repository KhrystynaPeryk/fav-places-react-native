import { useState, useCallback } from "react"
import { Text, ScrollView, StyleSheet, TextInput, View, Alert } from "react-native"
import { Colors } from "../../constants/colors"
import ImagePicker from "./ImagePicker"
import LocationPicker from "./LocationPicker"
import Button from "../../UI/Button"
import {Place} from '../../models/place'

const PlaceForm = ({onCreatPlace}) => {
    const [enteredTitle, setEnteredTitle] = useState('')
    const [pickedLocation, setPickedLocation] = useState()
    const [selectedImage, setSelectedImage] = useState()

    const changeTitleHandler = (enteredText) => {
        setEnteredTitle(enteredText)
    }
    
    const takeImageHandler = (imageIri) => {
        setSelectedImage(imageIri)
    }

    // wrapping it with useCallback because in LocationPicker component onPickLocation function is used as a dependency (it shouls be done to avoid potential infinite loops and rerenders) 
    const pickLocationHandler = useCallback((location) => {
        setPickedLocation(location)
    }, [])

    const savePlaceHandler = () => {
        // setIsLoading(true)
        if (!enteredTitle || !selectedImage || !pickedLocation) {
            Alert.alert('Some fields are empty.', 'Please enter all place info.')
            return
        }
        const placeDate = new Place(enteredTitle, selectedImage, pickedLocation)
        onCreatPlace(placeDate)
    }

    return (
        <ScrollView style={styles.form}>
            <View>
                <Text style={styles.label}>Title</Text>
                <TextInput style={styles.input} onChangeText={changeTitleHandler} value={enteredTitle}></TextInput>
            </View>
            <ImagePicker onTakeImage={takeImageHandler}/>
            <LocationPicker onPickLocation={pickLocationHandler}/>
            <Button onPress={savePlaceHandler}>Add Place</Button>
        </ScrollView>
    )
}

export default PlaceForm

const styles = StyleSheet.create({
    form: {
        flex: 1,
        padding: 24
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.primary500
    },
    input: {
        marginVertical: 8,
        paddingHorizontal: 4,
        paddingVertical: 8,
        fontSize: 16,
        borderBottomColor: Colors.primary700,
        borderBottomWidth: 2,
        backgroundColor: Colors.primary100
    }
})