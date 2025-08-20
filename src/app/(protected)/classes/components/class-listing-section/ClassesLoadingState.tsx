"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ClassesLoadingState: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-muted h-3 w-3 animate-pulse rounded-full" />
                <div>
                  <div className="bg-muted mb-1 h-4 w-32 animate-pulse rounded" />
                  <div className="bg-muted h-3 w-16 animate-pulse rounded" />
                </div>
              </div>
              <div className="bg-muted h-8 w-8 animate-pulse rounded" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="bg-muted h-4 w-4 animate-pulse rounded" />
              <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClassesLoadingState;
