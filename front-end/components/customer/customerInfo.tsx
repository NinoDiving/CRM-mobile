import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { fetchCustomerById } from "@/service/customer/fetchCustomer";

import { AuthService } from "@/service/auth/auth.service";
import { getCurrentLocation } from "@/service/localisation/localisation";
import { getAllVisits, getVisitById } from "@/service/visit/visit";
import { Customer } from "@/types/customer/customer";

import Constants from "expo-constants";
import { router } from "expo-router";

export default function CustomerInfo({ id }: { id: string }) {
  const [customer, setCustomer] = useState<Customer>();
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState<string>();
  const [visit, setVisit] = useState();
  useEffect(() => {
    const getEmployeeId = async () => {
      try {
        const userData = await AuthService.getUserData();
        setEmployeeId(userData.id);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur:",
          error
        );
      }
    };
    getEmployeeId();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCustomerById(id).then((data) => {
      setCustomer(data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const getVisit = async () => {
      const visit = await getVisitById(id);
      setVisit(visit);
      console.log(visit);
    };
    getVisit();
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
      const visitAlreadyExists = await getAllVisits().then((data) =>
        data.find(
          (visit: { customer_id: string }) => visit.customer_id === customer.id
        )
      );

      if (visitAlreadyExists) {
        Alert.alert("Erreur", "Une visite existe déjà pour ce client");
        return;
      }

      if (!employeeId) {
        console.error("ID de l'employé non disponible");
        Alert.alert(
          "Erreur",
          "Impossible de récupérer les informations de l'employé"
        );
        return;
      }

      const location = await getCurrentLocation(customer);

      if (location === undefined) {
        return;
      }

      const token = await AuthService.getToken();

      console.log("Employee ID:", employeeId);
      console.log("Customer ID:", id);

      const visitData = {
        customer_id: id,
        employee_id: employeeId,
        status: "Etude en cours",
      };

      console.log("Sending visit data:", visitData);

      const response = await fetch(
        `${Constants.expoConfig?.extra?.SERVER_URL}/visit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(visitData),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la création de la visite: ${responseText}`
        );
      }

      const createdVisit = JSON.parse(responseText);
      console.log("Visit created:", createdVisit);

      router.push({
        pathname: "/customer/visit",
        params: {
          customerId: id,
          visitId: createdVisit.id,
        },
      });
    } catch (error) {
      console.error("Erreur complète:", error);
      Alert.alert("Erreur", "Impossible de commencer la visite");
    }
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
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Statut: {visit?.status}</Text>
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
