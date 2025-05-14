import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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
});
