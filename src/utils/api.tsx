import { useQuery } from "@tanstack/react-query";
import { ToolsResponse, ToolRentalChargesResponse } from "../interfaces";

export const GetTools = () =>
  useQuery<ToolsResponse[]>({
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
  useQuery<ToolRentalChargesResponse[]>({
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
