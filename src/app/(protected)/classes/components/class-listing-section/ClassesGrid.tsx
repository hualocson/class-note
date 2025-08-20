"use client";

import useClassesQuery from "@/hooks/useClassesQuery";

import { ClassDataType } from "../form/schema";
import ClassCard from "./ClassCard";
import ClassesLoadingState from "./ClassesLoadingState";
import EmptyClassesState from "./EmptyClassesState";

interface IClassesGridProps {
  onEdit: (classItem: { id?: string; data: ClassDataType }) => void;
}

const ClassesGrid: React.FC<IClassesGridProps> = ({ onEdit }) => {
  const classesQueryData = useClassesQuery();

  const totalClasses = classesQueryData.data?.rowCount ?? 0;

  if (classesQueryData.isPending) {
    return <ClassesLoadingState />;
  }

  if (classesQueryData.data?.rowCount === 0) {
    return <EmptyClassesState />;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Total Classes: {totalClasses}</h3>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {classesQueryData.data?.rows.map((classItem) => (
          <ClassCard
            key={classItem.id}
            classItem={classItem}
            onEdit={() =>
              onEdit({
                id: classItem.id,
                data: {
                  name: classItem.name,
                  code: classItem.code || "",
                  price: classItem.price || 0,
                  color: classItem.color || "",
                  sortOrder: classItem.sortOrder || 0,
                },
              })
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ClassesGrid;
