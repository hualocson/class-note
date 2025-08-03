"use client";

import ClassesGrid from "./ClassesGrid";
import ClassesHeader from "./ClassesHeader";

const ClassListingSection: React.FC = () => {
  return (
    <section>
      {/* Classes List */}
      <ClassesHeader />
      <ClassesGrid />
    </section>
  );
};

export default ClassListingSection;
