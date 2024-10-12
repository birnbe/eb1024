interface ToolType {
  type: "chainsaw" | "ladder" | "jackhammer";
};

export interface ToolsResponse extends ToolType {
  code: "CHNS" | "LADW" | "JAKD" | "JAKR";
  brand: "Stihl" | "Werner" | "DeWalt" | "Ridgid";
};

export interface ToolRentalChargesResponse extends ToolType {
  dailyCharge: number;
}