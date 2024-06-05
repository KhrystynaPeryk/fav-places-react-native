import PlacesList from "../components/Places/PlacesList"
import { useIsFocused } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { fetchPlaces } from "../util/database"

const AllPlaces = ({route}) => {
    const isFocused = useIsFocused()
    const [loadedPlaces, setLoadedPlaces] = useState([])

    useEffect(() => {
        const loadPlaces = async() => {
            const places = await fetchPlaces()
            setLoadedPlaces(places)
        }
        if (isFocused) {
            // setLoadedPlaces((curPlaces) => [...curPlaces, route.params.place])
            loadPlaces()
        }
    },[isFocused, route])
    return (
        <PlacesList places={loadedPlaces} />
    )
}

export default AllPlaces