import { AuthService } from "@/service/auth/auth.service";
import { fetchCustomerById } from "@/service/customer/fetchCustomer";
import { fetchDocumentsByVisitId } from "@/service/documents/documents";
import { getCurrentLocation } from "@/service/localisation/localisation";
import { getAllVisits, getVisitByCustomerId } from "@/service/visit/visit";
import { Customer } from "@/types/customer/customer";
import { Documents } from "@/types/documents/documents";
import { Visit, VisitStatus } from "@/types/visit/visit";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CustomerInfo({ id }: { id: string }) {
  const [customer, setCustomer] = useState<Customer>();
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState<string>();
  const [visit, setVisit] = useState<Visit>();
  const [documents, setDocuments] = useState<Documents[]>([]);
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
      const visit = await getVisitByCustomerId(id);
      setVisit(visit);
    };
    getVisit();
  }, [id]);

  useEffect(() => {
    const getDocuments = async () => {
      if (visit?.id) {
        const documents = await fetchDocumentsByVisitId(visit.id);
        setDocuments(documents);
      }
    };
    getDocuments();
  }, [visit, documents]);

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

      const visitData = {
        customer_id: id,
        employee_id: employeeId,
        status: "Etude en cours",
      };

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

  const documentType = {
    id_card: "Carte identité",
    property_tax: "Taxe foncière",
    tax_notice: "Avis d'impôt",
    proof_of_address: "Preuve de domicile",
    edf_bill: "Facture EDF",
    payslip: "Bulletin de paie",
  };

  return (
    <ScrollView>
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
          <Text style={styles.label}>Statut:</Text>
          <Text style={styles.value}>
            {visit?.status ? visit?.status : VisitStatus.CONFIRMED}
          </Text>
          <Text style={styles.label}>Documents:</Text>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <View key={doc.id} style={styles.documentContainer}>
                <Text style={styles.value}>
                  {documentType[doc.type as keyof typeof documentType]}
                </Text>
                <Image
                  source={{ uri: doc.uri }}
                  style={styles.documentImage}
                  resizeMode="contain"
                />
                <Text style={styles.value}>
                  Date: {new Date(doc.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.value}>Aucun document</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleStartVisit}
          disabled={visit?.status !== VisitStatus.CONFIRMED}
        >
          <Text style={styles.buttonText}>
            {visit?.status === undefined ||
            visit?.status === VisitStatus.CONFIRMED ? (
              "Commencer la visite"
            ) : (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Valider les documents</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Ajouter un documents</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>
                    Demander une deuxième visite
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  documentContainer: {
    marginTop: 8,
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    gap: 10,
  },
  documentImage: {
    width: 300,
    height: 300,
    marginVertical: 8,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 20,
  },
});
