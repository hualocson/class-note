"use client";

import { useState } from "react";

import ClassDialog from "../ClassDialog";
import { ClassDataType } from "../form/schema";
import ClassesGrid from "./ClassesGrid";
import ClassesHeader from "./ClassesHeader";

const ClassListingSection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<{
    id?: string;
    data: ClassDataType;
  } | null>(null);

  return (
    <>
      <section>
        {/* Classes List */}
        <ClassesHeader
          onAddClass={() => {
            setClassToEdit(null);
            setIsDialogOpen(true);
          }}
        />
        <ClassesGrid
          onEdit={(classItem) => {
            setClassToEdit(classItem);
            setIsDialogOpen(true);
          }}
        />
      </section>

      <ClassDialog
        openState={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultValues={classToEdit || undefined}
      />
    </>
  );
};

export default ClassListingSection;
