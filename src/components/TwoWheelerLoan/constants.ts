import { LoanStatus } from "@/lib/two-wheeler-loan";

export const TwoWheelerRoutes = {
  TWO_WHEELER_LOAN: "/two-wheeler-loan",
  CONFIRM_DETAILS: "/confirm-details",
  VEHICLE_DETAILS: "/vehicle-details",
  APPLICATION_STATUS: "/application-status",
  TERMS_AND_CONDITIONS: "/terms-and-conditions",
};

export const STATUS_TO_SHOW_APPLICATION_DETAILS_SECTION = [
  LoanStatus.APPROVED,
  LoanStatus.DISBURSED,
];
