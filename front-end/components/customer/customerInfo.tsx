import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { fetchCustomerById } from "@/service/customer/fetchCustomer";
import { Customer } from "@/types/customer/customer";

export default function CustomerInfo({ id }: { id: string }) {
  const [customer, setCustomer] = useState<Customer>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCustomerById(id).then((data) => {
      setCustomer(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.container}>
        <Text>Client non trouvé</Text>
      </View>
    );
  }

  const handleStartVisit = async () => {
    try {
      // Demander la permission de géolocalisation
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "La géolocalisation est nécessaire pour commencer la visite"
        );
        return;
      }

      // Obtenir la position actuelle
      const location = await Location.getCurrentPositionAsync({});
      const commercialLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Calculer la distance entre le commercial et le client
      const distance = calculateDistance(
        commercialLocation.latitude,
        commercialLocation.longitude,
        customer.latitude,
        customer.longitude
      );

      // Vérifier si le commercial est assez proche (par exemple, dans un rayon de 100 mètres)
      const MAX_DISTANCE = 0.1; // 100 mètres en kilomètres
      if (distance > MAX_DISTANCE) {
        Alert.alert(
          "Trop loin",
          `Vous êtes à ${Math.round(
            distance * 1000
          )} mètres du client. Veuillez vous rapprocher.`
        );
        return;
      }

      // Si tout est ok, commencer la visite
      // ... votre code pour commencer la visite ...
    } catch (error) {
      console.error("Erreur de géolocalisation:", error);
      Alert.alert("Erreur", "Impossible d'obtenir votre position");
    }
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{customer.fullname}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{customer.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Téléphone:</Text>
        <Text style={styles.value}>{customer.phone}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Adresse:</Text>
        <Text style={styles.value}>{customer.address}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Ville:</Text>
        <Text style={styles.value}>{customer.city}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Code postal:</Text>
        <Text style={styles.value}>{customer.zipcode}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleStartVisit}>
        <Text style={styles.buttonText}>Commencer la visite</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
