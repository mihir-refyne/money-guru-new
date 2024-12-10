import LoadingPage from "@/components/LoadingPage";
import OrderDetails from "@/components/OrderDetails";
import PageLayout from "@/components/PageLayout";
import useFetcher from "@/hooks/useFetcher";
import { getOrderItemInfo } from "@/lib/order";
import { useRouter } from "next/router";

interface OrderDetailsProps {
  id: string;
}

export default function OrderDetailsPage({}: OrderDetailsProps) {
  const router = useRouter();
  const { shopifyOrderId, orderItemId, userToken } = router.query;

  const { data, isLoading, error } = useFetcher(() => {
    return getOrderItemInfo({
      userToken,
      shopifyOrderId,
      orderItemId,
    });
  });

  if (isLoading) return <LoadingPage />;

  return (
    <PageLayout pageBackground="var(--clr-background-surface)">
      <OrderDetails orderDetail={data} />
    </PageLayout>
  );
}
