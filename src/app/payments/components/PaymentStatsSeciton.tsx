"use client";

import { PropsWithChildren, useEffect, useState } from "react";

import { getPayments } from "@/actions/payments";
import { PaymentStatus } from "@/enums";
import formatPrice from "@/lib/format-price";
import { Clock, DollarSign, TrendingUp, XCircle } from "lucide-react";
import { toast } from "sonner";

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

interface PaymentStats {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  cancelledAmount: number;
}

const PaymentStatsSection: React.FC = () => {
  const [stats, setStats] = useState<PaymentStats>({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    cancelledAmount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const result = await getPayments();

        if (result.success) {
          const payments = result.data.rows;

          // Calculate stats from the payments data
          const newStats = payments.reduce(
            (acc, payment) => {
              const amount = Number(payment.amount);
              acc.totalAmount += amount;

              switch (payment.status) {
                case PaymentStatus.PAID:
                  acc.paidAmount += amount;
                  break;
                case PaymentStatus.PENDING:
                  acc.pendingAmount += amount;
                  break;
                case PaymentStatus.CANCELLED:
                  acc.cancelledAmount += amount;
                  break;
              }

              return acc;
            },
            {
              totalAmount: 0,
              paidAmount: 0,
              pendingAmount: 0,
              cancelledAmount: 0,
            }
          );

          setStats(newStats);
        } else {
          toast.error(result.error || "Failed to load payment stats");
        }
      } catch (error) {
        console.error("Error fetching payment stats:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
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
              {formatPrice(stats.totalAmount)}
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
              {formatPrice(stats.paidAmount)}
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
              {formatPrice(stats.pendingAmount)}
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
              {formatPrice(stats.cancelledAmount)}
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
                  {formatPrice(stats.totalAmount)}
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
                  {formatPrice(stats.paidAmount)}
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
                  {formatPrice(stats.pendingAmount)}
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
                  {formatPrice(stats.cancelledAmount)}
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
