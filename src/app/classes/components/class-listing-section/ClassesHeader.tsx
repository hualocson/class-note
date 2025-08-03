"use client";

import { Input } from "@/components/ui/input";

import ClassActions from "./ClassActions";

const ClassesHeader: React.FC = () => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Input
          type="search"
          placeholder="Search classes..."
          className="w-[300px]"
        />
      </div>
      <ClassActions />
    </div>
  );
};

export default ClassesHeader;
