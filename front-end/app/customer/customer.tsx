import CustomerInfo from "@/components/customer/customerInfo";
import { useLocalSearchParams } from "expo-router";
export default function CustomerScreen() {
  const { id } = useLocalSearchParams();
  return <CustomerInfo id={id as string} />;
}
