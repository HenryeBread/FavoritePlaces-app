import { useEffect } from "react";
import PlacesList from "../components/Places/PlacesList";
import { useIsFocused } from '@react-navigation/native';
import { fetchPlaces } from "../util/database";

function AllPlaces({route}) {
    const [loadedPlaces, setLoadedPlaces] = useState();

    const isFocused = useIsFocused();
    useEffect(() => {
        async function loadPlaces() {
           const places = await fetchPlaces();
           setLoadedPlaces(places);
        }

        if (isFocused && route.params){
            loadPlaces();
            //setLoadedPlaces(curPlaces => [...curPlaces, route.params.place]);
        }
    }, [isFocused, route]);
    
    return (
        <PlacesList places={loadedPlaces}/>
    )
}

export default AllPlaces;