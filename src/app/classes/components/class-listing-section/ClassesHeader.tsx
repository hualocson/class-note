"use client";

import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

import ClassActions from "./ClassActions";

const ClassesHeader: React.FC = () => {
  return (
    <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center">
      <div className="relative flex grow items-center gap-2">
        <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
          <SearchIcon className="size-4" />
        </span>
        <Input type="search" placeholder="Search classes..." className="pl-8" />
      </div>
      <ClassActions />
    </div>
  );
};

export default ClassesHeader;
