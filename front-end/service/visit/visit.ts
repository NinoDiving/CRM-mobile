import Constants from "expo-constants";
import { AuthService } from "../auth/auth.service";

export const getVisitByCustomerId = async (customerId: string) => {
  const response = await fetch(
    `${Constants.expoConfig?.extra?.SERVER_URL}/visit/customer/${customerId}`
  );
  return response.json();
};

export const getAllVisits = async () => {
  const token = await AuthService.getToken();
  const response = await fetch(
    `${Constants.expoConfig?.extra?.SERVER_URL}/visit`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.json();
};

export const getVisitById = async (visitId: string) => {
  const response = await fetch(
    `${Constants.expoConfig?.extra?.SERVER_URL}/visit/${visitId}`
  );
  return response.json();
};
