import { insertPlace } from "../util/database"
import PlaceForm from "../components/Places/PlaceForm"

const AddPlace = ({navigation}) => {
    const createPlaceHandler = async (place) => {
        try {
            await insertPlace(place);
            navigation.navigate('AllPlaces');
        } catch (error) {
            console.error('Failed to insert place:', error);
        }
    };
    return (
        <PlaceForm onCreatPlace={createPlaceHandler}/>
    )
}

export default AddPlace