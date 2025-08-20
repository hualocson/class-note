"use client";

import { BookOpen, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

const EmptyClassesState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BookOpen className="text-muted-foreground mb-4 h-12 w-12" />
      <h3 className="mb-2 text-lg font-semibold">No classes found</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        Get started by adding your first class. Track your learning journey and
        manage your course expenses.
      </p>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add Your First Class
      </Button>
    </div>
  );
};

export default EmptyClassesState;
