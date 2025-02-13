import { Colors } from "../../constants/Colors";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location';
import OutlinedButton from "../ui/OutlinedButton";
import { StyleSheet, Alert, Image } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import { getAddress } from "../../util/Location";

function LocationPicker({ onPickLocation }) {
    const [pickedLocation, setPickedLocation] = useState();
    const isFocused = useIsFocused();
    
    const navigation = useNavigation();
    const route = useRoute();
    
    const [locatoinPermissionInformation, requestPermission] = useForegroundPermissions();

    

    useEffect(() => {
        if (isFocused && route.params) {
            const mapPickedLocation = {
                lat: route.params.pickedLat, 
                lng: route.params.pickedLng
            };
        setPickedLocation(mapPickedLocation);
        }
        
        
    }, [route, isFocused]);

    useEffect(() => {
        async function handleLocation() {
            if (pickedLocation) {
                getAddress(pickedLocation.lat, pickedLocation.lng);
                onPickLocation({...pickedLocation, address: address });
            }
        }

        handleLocation();
    }, [pickedLocation, onPickLocation]);

    async function verifyPermissions() {
        if (locatoinPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();

            return permissionResponse.granted;
        }

        if (locatoinPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Insufficient Permissions!',
                'You need to grant location permissions to use this app.'
            )
        }
    }

    async function getLocationHandler() {
       const hasPermission = await verifyPermissions();

        if (!hasPermission) {
            return;
        }

       const location = await getCurrentPositionAsync();
       setPickedLocation({
        lat: location.coords.latitude,
        long: location.coords.longitude   
       })
    }

    function pickOnMapHandler() {
        navigation.navigate('Map');
    }

    let locationPreview = <Text>No location picked yet.</Text>

    if (pickedLocation){
        locationPreview = (
            <Image 
                style={styles.image}
                source={{
                  uri: getMapPreview(pickedLocation.lat, pickedLocation.long),
                }}
            />
        );
    }

    return (
        <View>
            <View style={styles.mapPreview}>
                {locationPreview}
            </View>
            <View style={styles.actions}>
                <OutlinedButton icon="location" onPress={getLocationHandler}>Locate User</OutlinedButton>
                <OutlinedButton icon="map" onPress={pickOnMapHandler}>Pick on Map</OutlinedButton>
            </View>
        </View>
    )
}

export default LocationPicker;

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
    }
})