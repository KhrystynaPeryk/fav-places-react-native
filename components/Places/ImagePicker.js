import { StyleSheet, View, Text, Alert, Image } from "react-native"
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from "expo-image-picker"
import { useState, useEffect } from "react"
import { Colors } from "../../constants/colors"
import OutlinedButton from "../../UI/OutlinedButton"

const ImagePicker = ({onTakeImage}) => {
    const [pickedImg, setPickedImg] =  useState()
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions() // this is ONLY for iOS - because it does not ask for permsions automatically as on Android

    const verifyPermissions = async () => {  // only for iOS - returns true or false depending whether we've got the permissions or not
        if (!cameraPermissionInformation) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }
        
        if (cameraPermissionInformation.status === PermissionStatus.DENIED && cameraPermissionInformation.canAskAgain) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }

        if (cameraPermissionInformation.status === PermissionStatus.DENIED) { // user denies permission
            Alert.alert('Insufficient Permissions!', 'You need to grant permissions to use this app')
            return false
        }

        return true
    }

    const takeImageHandler = async() => {
        const hasPermission = await verifyPermissions()

        if (!hasPermission) { // if we do not have permissions - cancel the execution
            return
        }
        const image = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16,9],
            quality: 0.5, // it is better to restrict the quality because it can be too large on some devices
        })
        setPickedImg(image.assets[0].uri)
        onTakeImage(image.assets[0].uri)
    }

    let imagePreview = <Text>No image taken yet!</Text>

    if (pickedImg) {
        imagePreview = <Image style={styles.image} source={{uri: pickedImg}} />
    }

    return (
        <View>
            <View style={styles.imagePreview}>{imagePreview}</View>
            <OutlinedButton onPress={takeImageHandler} icon='camera'>Take Image</OutlinedButton>
        </View>
    )
}

export default ImagePicker

const styles = StyleSheet.create({
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4
    },
    image: {
        width: '100%',
        height: '100%'
    }
})