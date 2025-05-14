import { Customer } from "@/types/customer/customer";
import * as Location from "expo-location";
import { Alert } from "react-native";

// Fonction pour calculer la distance entre deux points (formule de Haversine)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance en km
  return distance;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

export const getCurrentLocation = async (customer: Customer) => {
  try {
    // Vérification de la géolocalisation
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "La géolocalisation est nécessaire");
      return undefined;
    }

    const location = await Location.getCurrentPositionAsync({});
    const commercialLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    const distance = calculateDistance(
      commercialLocation.latitude,
      commercialLocation.longitude,
      customer.latitude,
      customer.longitude
    );

    const MAX_DISTANCE = 0.1;
    if (distance > MAX_DISTANCE) {
      Alert.alert(
        "Trop loin",
        `Vous êtes à ${Math.round(distance * 1000)} mètres du client`
      );
      return undefined;
    }

    return commercialLocation;
  } catch (error) {
    console.error("Erreur lors de la récupération de la localisation:", error);
    throw error;
  }
};
