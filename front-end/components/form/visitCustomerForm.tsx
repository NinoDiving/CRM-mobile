import { AuthService } from "@/service/auth/auth.service";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Document = {
  type: string;
  uri: string;
  name: string;
};

const DOCUMENT_TYPES = [
  { id: "id_card", label: "Pièce d'identité (recto/verso)" },
  { id: "property_tax", label: "Taxe foncière" },
  { id: "tax_notice", label: "Avis d'impôt" },
  { id: "proof_of_address", label: "Justificatif de domicile" },
  { id: "edf_bill", label: "Facture EDF" },
  { id: "payslip", label: "Dernier bulletin de salaire" },
];

export default function VisitCustomerForm() {
  const { customerId, visitId } = useLocalSearchParams<{
    customerId: string;
    visitId: string;
  }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [documents, setDocuments] = useState<Record<string, Document>>({});

  const pickImage = async (documentType: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setDocuments((prev) => ({
          ...prev,
          [documentType]: {
            type: documentType,
            uri: result.assets[0].uri,
            name: result.assets[0].uri.split("/").pop() || "image",
          },
        }));
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
    }
  };

  const takePhoto = async (documentType: string) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "L'accès à la caméra est nécessaire");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setDocuments((prev) => ({
          ...prev,
          [documentType]: {
            type: documentType,
            uri: result.assets[0].uri,
            name: result.assets[0].uri.split("/").pop() || "photo",
          },
        }));
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", "Impossible de prendre la photo");
    }
  };

  const pickDocument = async (documentType: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
      });

      if (!result.canceled) {
        setDocuments((prev) => ({
          ...prev,
          [documentType]: {
            type: documentType,
            uri: result.assets[0].uri,
            name: result.assets[0].name,
          },
        }));
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", "Impossible de sélectionner le document");
    }
  };

  const renderDocumentUpload = (documentType: string, label: string) => (
    <View style={styles.documentContainer}>
      <Text style={styles.documentLabel}>{label}</Text>
      <View style={styles.uploadButtons}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => pickImage(documentType)}
        >
          <Ionicons name="image-outline" size={24} color="#007AFF" />
          <Text style={styles.buttonText}>Galerie</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => takePhoto(documentType)}
        >
          <Ionicons name="camera-outline" size={24} color="#007AFF" />
          <Text style={styles.buttonText}>Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => pickDocument(documentType)}
        >
          <Ionicons name="document-outline" size={24} color="#007AFF" />
          <Text style={styles.buttonText}>Fichier</Text>
        </TouchableOpacity>
      </View>
      {documents[documentType] && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: documents[documentType].uri }}
            style={styles.preview}
          />
          <Text style={styles.fileName}>{documents[documentType].name}</Text>
        </View>
      )}
    </View>
  );

  const renderStep = () => {
    const startIndex = currentStep * 2;
    const endIndex = Math.min(startIndex + 2, DOCUMENT_TYPES.length);
    const currentDocuments = DOCUMENT_TYPES.slice(startIndex, endIndex);

    const handleSumbitDocuments = async () => {
      try {
        const token = await AuthService.getToken();
        for (const [type, doc] of Object.entries(documents)) {
          const documentToSend = {
            type: type,
            uri: doc.uri,
            name: doc.name,
            customer_id: customerId,
            visit_id: visitId,
          };

          console.log("Envoi du document:", documentToSend);

          const response = await fetch(
            `${Constants.expoConfig?.extra?.SERVER_URL}/document`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(documentToSend),
            }
          );

          const responseData = await response.text();
          console.log("Réponse du serveur:", responseData);

          if (!response.ok) {
            throw new Error(`Erreur: ${responseData}`);
          }
        }

        Alert.alert("Succès", "Les documents ont été envoyés avec succès");
      } catch (error) {
        console.error("Erreur complète:", error);
        Alert.alert("Erreur", "Impossible d'envoyer les documents");
      }
    };

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.stepTitle}>
          Étape {currentStep + 1} sur {Math.ceil(DOCUMENT_TYPES.length / 2)}
        </Text>
        {currentDocuments.map((doc) => (
          <View key={doc.id}>{renderDocumentUpload(doc.id, doc.label)}</View>
        ))}
        <View style={styles.navigationButtons}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.navButtonText}>Précédent</Text>
            </TouchableOpacity>
          )}
          {currentStep < Math.ceil(DOCUMENT_TYPES.length / 2) - 1 ? (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentStep(currentStep + 1)}
            >
              <Text style={styles.navButtonText}>Suivant</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.submitButton]}
              onPress={handleSumbitDocuments}
            >
              <Text style={styles.navButtonText}>Terminer</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  };

  return renderStep();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  documentContainer: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  documentLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  uploadButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  uploadButton: {
    alignItems: "center",
    padding: 10,
  },
  buttonText: {
    color: "#007AFF",
    marginTop: 5,
  },
  previewContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  preview: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  fileName: {
    marginTop: 5,
    color: "#666",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  navButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  navButtonText: {
    color: "white",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#34C759",
  },
});
