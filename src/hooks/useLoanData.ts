import { useEffect, useState } from "react";
import useFetcher from "./useFetcher";
import { VehicleLoan, fetchAllLoans } from "@/lib/two-wheeler-loan";

export function useLoanData() {
  const { isLoading, data, error } = useFetcher(fetchAllLoans);
  const [loanData, setLoanData] = useState<VehicleLoan | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setLoanData(data[0]);
    }
  }, [data]);

  return { isLoading, loanData, error };
}
