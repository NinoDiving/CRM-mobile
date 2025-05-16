import Constants from "expo-constants";

export const fetchDocumentsByVisitId = async (visitId: string) => {
  const response = await fetch(
    `${Constants.expoConfig?.extra?.SERVER_URL}/document/visit/${visitId}`
  );
  return response.json();
};

export const fetchDocumentsByCustomerId = async (customerId: string) => {
  const response = await fetch(
    `${Constants.expoConfig?.extra?.SERVER_URL}/document/customer/${customerId}`
  );
  return response.json();
};
