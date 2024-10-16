interface ToolType {
  type: "chainsaw" | "ladder" | "jackhammer";
};

export interface ToolsResponse extends ToolType {
  code: "CHNS" | "LADW" | "JAKD" | "JAKR";
  brand: "Stihl" | "Werner" | "DeWalt" | "Ridgid";
};

export type ChargeableDays = {
  weekday: boolean;
  weekend: boolean;
  holiday: boolean;
}
export interface ToolRentalChargesResponse extends ToolType {
  dailyCharge: number;
  charges: ChargeableDays;
}

export interface ToolFullData extends ToolsResponse, ToolRentalChargesResponse {}