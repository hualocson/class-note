"use client";

import { PropsWithChildren } from "react";

import { getPaymentStats } from "@/actions/payments";
import formatPrice from "@/lib/format-price";
import { useQuery } from "@tanstack/react-query";
import { Clock, DollarSign, TrendingUp, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const MobileItem: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <CarouselItem className="flex-[0_0_80%] pl-2">{children}</CarouselItem>
  );
};

const PaymentStatsSection: React.FC = () => {
  const { data, isPending } = useQuery({
    queryKey: ["payment-stats", new Date().getMonth()],
    queryFn: async () => {
      const result = await getPaymentStats();

      if (!result.success) {
        throw new Error(result.error || "Failed to load payment stats");
      }

      return result.data;
    },
  });

  if (isPending) {
    return (
      <div className="mb-6">
        <div className="hidden gap-2 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                <div className="bg-muted h-4 w-4 animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="bg-muted h-8 w-20 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(1)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                <div className="bg-muted h-4 w-4 animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="bg-muted h-8 w-20 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="hidden gap-2 md:grid md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(data?.totalAmount ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(data?.paidAmount ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Amount
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(data?.pendingAmount ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cancelled Amount
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(data?.cancelledAmount ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Carousel className="md:hidden">
        <CarouselContent className="-ml-1 w-full">
          <MobileItem>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Amount
                </CardTitle>
                <DollarSign className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(data?.totalAmount ?? 0)}
                </div>
              </CardContent>
            </Card>
          </MobileItem>

          <MobileItem>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Paid Amount
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(data?.paidAmount ?? 0)}
                </div>
              </CardContent>
            </Card>
          </MobileItem>

          <MobileItem>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Amount
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(data?.pendingAmount ?? 0)}
                </div>
              </CardContent>
            </Card>
          </MobileItem>

          <MobileItem>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cancelled Amount
                </CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(data?.cancelledAmount ?? 0)}
                </div>
              </CardContent>
            </Card>
          </MobileItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default PaymentStatsSection;
