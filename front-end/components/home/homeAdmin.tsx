import SearchBar from "@/components/searchBar/searchBar";
import { fetchCustomers } from "@/service/customer/fetchCustomer";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
type Customer = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipcode: string;
  employee_affected: {
    firstname: string;
    lastname: string;
  };
};

export default function HomeAdmin() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCustomers().then((data) => {
      setCustomers(data);
      setDisplayedCustomers(data);
    });
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCustomers().then((data) => {
      setCustomers(data);
      setDisplayedCustomers(data);
      setRefreshing(false);
    });
  }, []);

  const handleSearchResults = (results: Customer[]) => {
    setDisplayedCustomers(results);
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/customer/customer",
          params: { id: item.id.toString() },
        })
      }
    >
      <View style={styles.cardHeader} key={item.id}>
        <Text style={styles.name}>{item.fullname}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.info}>📱 {item.phone}</Text>
        <Text style={styles.info}>📍 {item.address}</Text>
        <Text style={styles.info}>
          {item.city}, {item.zipcode}
        </Text>
      </View>

      {item.employee_affected && (
        <View style={styles.cardFooter}>
          <Text style={styles.assignedTo}>
            Commercial assigné: {item.employee_affected.firstname}{" "}
            {item.employee_affected.lastname}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Clients</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/customer/createCustomer")}
        >
          <Text style={styles.addButtonText}>Ajouter un client</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/employee/createEmployee")}
        >
          <Text style={styles.addButtonText}>Ajouter un employé</Text>
        </TouchableOpacity>
      </View>
      <SearchBar onSearchResults={handleSearchResults} />

      <FlatList
        data={displayedCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.id}
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
