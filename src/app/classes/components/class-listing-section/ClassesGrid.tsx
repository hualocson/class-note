"use client";

import { useEffect, useState } from "react";

import { getClasses } from "@/actions/classes";
import { SelectClassType } from "@/schemas/classes";
import { toast } from "sonner";

import ClassCard from "./ClassCard";
import ClassesLoadingState from "./ClassesLoadingState";
import EmptyClassesState from "./EmptyClassesState";

const ClassesGrid: React.FC = () => {
  const [classes, setClasses] = useState<SelectClassType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const result = await getClasses();

      if (result.success) {
        setClasses(result.data.rows);
      } else {
        toast.error(result.error || "Failed to load classes");
      }
    } catch (error) {
      console.error("Error loading classes:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ClassesLoadingState />;
  }

  if (classes.length === 0) {
    return <EmptyClassesState />;
  }

  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((classItem) => (
        <ClassCard key={classItem.id} classItem={classItem} />
      ))}
    </div>
  );
};

export default ClassesGrid;
