import { useQuery } from "@tanstack/react-query";
import { toolsResponse, toolRentalChargesResponse } from "../types";

export const GetTools = () =>
  useQuery<toolsResponse[]>({
    queryKey: ["tools"],
    enabled: false,
    queryFn: async () => {
      const response = await fetch("/tools.json");
      if (!response.ok) {
        throw new Error("Tools response was not ok");
      }
      return await response.json();
    },
  });

export const GetRentalCharges = () =>
  useQuery<toolRentalChargesResponse[]>({
    queryKey: ["rentalCharges"],
    enabled: false,
    queryFn: async () => {
      const response = await fetch("/toolrentalcharges.json");
      if (!response.ok) {
        throw new Error("Rental charges response was not ok");
      }
      return await response.json();
    },
  });
