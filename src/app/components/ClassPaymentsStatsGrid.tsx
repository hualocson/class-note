"use client";

import { useState } from "react";

import { getPaymentsClassStats } from "@/actions/payments";
import { PaymentStatus } from "@/enums";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import MonthSelect from "./MonthSelect";
import PaymentStatusSelect from "./PaymentStatusSelect";

const ErrorState = () => {
  return (
    <div className="flex items-center justify-center p-8 text-sm text-red-500">
      <span>An error occurred while loading the data</span>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="text-muted-foreground flex items-center justify-center p-8 text-sm">
      <span>No data found</span>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-muted size-3 animate-pulse rounded-full" />
                <div className="bg-muted h-5 w-24 animate-pulse rounded" />
              </div>
              <div className="bg-muted h-4 w-12 animate-pulse rounded" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted h-8 w-32 animate-pulse rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ClassPaymentsStatsGrid = () => {
  const [month, setMonth] = useState<Date>(new Date());
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    PaymentStatus.PENDING
  );
  const queryData = useQuery({
    queryKey: ["payments-class-stats", month.toISOString(), paymentStatus],
    queryFn: async () => {
      const result = await getPaymentsClassStats({
        month: month.toISOString(),
        status: paymentStatus,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to load payments class stats");
      }

      return result.data;
    },
  });

  const totalAmount = queryData.data?.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0
  );

  return (
    <section className="space-y-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">
          Total:{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalAmount ?? 0)}
        </h3>
        <div className="flex items-center gap-2">
          <PaymentStatusSelect
            value={paymentStatus}
            onChange={(status) => setPaymentStatus(status)}
            className="w-full sm:w-[180px]"
          />
          <MonthSelect value={month} onChange={setMonth} />
        </div>
      </div>
      {queryData.isPending ? (
        <LoadingState />
      ) : queryData.isError || !queryData.data ? (
        <ErrorState />
      ) : queryData.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {queryData.data.map((stat) => (
            <Card key={stat.classId} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-full"
                      style={{
                        backgroundColor: stat.classColor ?? "transparent",
                      }}
                    />
                    <CardTitle className="text-base font-medium">
                      {stat.className}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {stat.classCode}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(stat.totalAmount)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default ClassPaymentsStatsGrid;
