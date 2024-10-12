export type toolsResponse = {
  type: "chainsaw" | "ladder" | "jackhammer";
  code: "CHNS" | "LADW" | "JAKD" | "JAKR";
  brand: "Stihl" | "Werner" | "DeWalt" | "Ridgid";
};

export type toolRentalChargesResponse = {
  type: "chainsaw" | "ladder" | "jackhammer";
  dailyCharge: number;
};
