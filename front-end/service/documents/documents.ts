import Constants from "expo-constants";
import { AuthService } from "../auth/auth.service";

export const fetchDocumentsByVisitId = async (visitId: string) => {
  const token = await AuthService.getToken();
  const response = await fetch(
    `${Constants.expoConfig?.extra?.SERVER_URL}/document/visit/${visitId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.json();
};

export const fetchDocumentsByCustomerId = async (customerId: string) => {
  const token = await AuthService.getToken();
  const response = await fetch(
    `${Constants.expoConfig?.extra?.SERVER_URL}/document/customer/${customerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.json();
};
