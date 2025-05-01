import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import { AuthService } from "@/service/auth/auth.service";
import { useRouter } from "expo-router";
import SearchBar from "@/components/searchBar/searchBar";
interface Customer {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  employeeAffected: {
    firstname: string;
    lastname: string;
  };
}

export default function ExploreScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const fetchCustomers = async () => {
    try {
      const token = await AuthService.getToken();
      const response = await fetch(
        `${Constants.expoConfig?.extra?.serverUrl}/customer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCustomers();
  }, []);

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.fullname}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.info}>📱 {item.phone}</Text>
        <Text style={styles.info}>📍 {item.address}</Text>
        <Text style={styles.info}>
          {item.city}, {item.zipCode}
        </Text>
      </View>

      {item.employeeAffected && (
        <View style={styles.cardFooter}>
          <Text style={styles.assignedTo}>
            Commercial assigné: {item.employeeAffected.firstname}{" "}
            {item.employeeAffected.lastname}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Clients</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(tabs)/createCustomer")}
        >
          <Text style={styles.addButtonText}>Ajouter un client</Text>
        </TouchableOpacity>
      </View>
      <SearchBar />

      <FlatList
        data={customers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    gap: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardBody: {
    marginBottom: 8,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    color: "#666",
    marginTop: 4,
  },
  info: {
    marginVertical: 2,
    color: "#444",
  },
  assignedTo: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
