"use client";

import useClassAction from "@/hooks/useClassAction";
import formatPrice from "@/lib/format-price";
import { SelectClassType } from "@/schemas/classes";
import { BookOpen, Edit, Loader2, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClassCardProps {
  classItem: SelectClassType;
  onEdit: (classItem: SelectClassType) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem, onEdit }) => {
  const { deleteClassMutation } = useClassAction();

  const handleDelete = () => {
    deleteClassMutation.mutate(classItem.id);
  };

  return (
    <Card className="group relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: classItem.color || "#3b82f6" }}
            />
            <div>
              <h3 className="font-semibold">{classItem.name}</h3>
              {classItem.code && (
                <p className="text-muted-foreground text-sm">
                  {classItem.code}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(classItem)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={deleteClassMutation.isPending}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteClassMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-muted-foreground h-4 w-4" />
            <span className="font-semibold">
              {formatPrice(Number(classItem.price))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
