"use client";

import { useEffect, useState } from "react";

import { deleteClass, getClasses } from "@/actions/classes";
import formatDate from "@/lib/format-date";
import formatPrice from "@/lib/format-price";
import { type SelectClassType } from "@/schemas/classes";
import { Edit, MoreHorizontal, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ClassDialog from "./ClassDialog";
import { ClassDataType } from "./form/schema";

interface ClassesListingProps {
  className?: string;
}

const ClassesListing: React.FC<ClassesListingProps> = ({ className }) => {
  const [classes, setClasses] = useState<SelectClassType[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedClass, setSelectedClass] = useState<{
    id?: string;
    data: ClassDataType;
  } | null>(null);

  // Load classes on component mount
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

  const handleDeleteClass = async (id: string) => {
    try {
      const result = await deleteClass(id);

      if (result.success) {
        toast.success("Class deleted successfully");
        loadClasses(); // Reload the list
      } else {
        toast.error(result.error || "Failed to delete class");
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("An unexpected error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={className}>
        {/* Header with add button */}
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Classes</h2>
            <p className="text-muted-foreground">
              Manage your classes and track their details
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* refresh button */}
            <Button variant="outline" onClick={loadClasses}>
              <RefreshCcw />
              Refresh
            </Button>

            <ClassDialog />
          </div>
        </div>

        {/* Classes grid */}
        {classes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Plus className="text-muted-foreground h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No classes yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first class
                </p>
                <ClassDialog />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Card
                key={cls.id}
                className="group transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-lg font-semibold">
                        {cls.name}
                      </CardTitle>
                      {cls.code && (
                        <CardDescription className="text-muted-foreground text-sm">
                          Code: {cls.code}
                        </CardDescription>
                      )}
                    </div>

                    {/* Color indicator */}
                    <div
                      className="ml-2 h-4 w-4 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: cls.color || "#3b82f6" }}
                    />
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Price:
                      </span>
                      <Badge variant="secondary" className="font-mono">
                        {formatPrice(cls.price)}
                      </Badge>
                    </div>

                    {/* Created date */}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Created:
                      </span>
                      <span className="text-sm">
                        {formatDate(cls.createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t pt-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Sort: {cls.sortOrder}
                        </Badge>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedClass({
                                id: cls.id,
                                data: {
                                  name: cls.name,
                                  code: cls.code || undefined,
                                  price: cls.price,
                                  color: cls.color || "#3b82f6",
                                  sortOrder: cls.sortOrder || 0,
                                },
                              });
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDeleteClass(cls.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ClassDialog
        openState={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultValues={selectedClass ? selectedClass : undefined}
      />
    </>
  );
};

export default ClassesListing;
