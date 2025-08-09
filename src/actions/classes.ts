"use server";

import { revalidatePath } from "next/cache";

import {
  type ClassDataType,
  classSchema,
} from "@/app/classes/components/form/schema";
import { db } from "@/db";
import { SelectClassType, classesTable } from "@/schemas/classes";
import { eq, isNull } from "drizzle-orm";

import {
  makeActionError,
  makeActionListSuccess,
  makeActionSuccess,
} from "./utils";

export async function createClass(
  data: ClassDataType
): Promise<ActionResponse<SelectClassType>> {
  try {
    // Validate the input data
    const validatedData = classSchema.parse(data);

    // Insert the class into the database
    const [newClass] = await db
      .insert(classesTable)
      .values({
        name: validatedData.name,
        code: validatedData.code,
        price: validatedData.price,
        color: validatedData.color,
        sortOrder: validatedData.sortOrder,
      })
      .returning();

    revalidatePath("/classes");

    return makeActionSuccess(newClass);
  } catch (error) {
    console.error("Error creating class:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to create class");
  }
}

export async function updateClass(id: string, data: ClassDataType) {
  try {
    // Validate the input data
    const validatedData = classSchema.parse(data);

    // Update the class in the database
    const [updatedClass] = await db
      .update(classesTable)
      .set({
        name: validatedData.name,
        code: validatedData.code,
        price: validatedData.price,
        color: validatedData.color,
        sortOrder: validatedData.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(classesTable.id, id))
      .returning();

    if (!updatedClass) {
      return makeActionError("Class not found");
    }

    revalidatePath("/classes");

    return makeActionSuccess(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to update class");
  }
}

export async function deleteClass(id: string) {
  try {
    // Soft delete the class, change name and code to deleted_name<old_name> and deleted_code_<oldcode>
    const [oldClass] = await db
      .select()
      .from(classesTable)
      .where(eq(classesTable.id, id))
      .limit(1);

    if (!oldClass) {
      return makeActionError("Class not found");
    }

    const [deletedClass] = await db
      .update(classesTable)
      .set({
        name: `deleted_name_${oldClass.name}`,
        code: `deleted_code_${oldClass.code}`,
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(classesTable.id, id))
      .returning();

    if (!deletedClass) {
      return makeActionError("Class not found");
    }

    // Revalidate the classes page
    revalidatePath("/classes");

    return makeActionSuccess(deletedClass);
  } catch (error) {
    console.error("Error deleting class:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to delete class");
  }
}

export async function getClasses() {
  try {
    const classes = await db
      .select()
      .from(classesTable)
      .where(isNull(classesTable.deletedAt))
      .orderBy(classesTable.sortOrder, classesTable.name);

    // !row count here is total number of classes that are not deleted (it will not equal length if use pagination )
    return makeActionListSuccess({ rows: classes, rowCount: classes.length });
  } catch (error) {
    console.error("Error fetching classes:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to fetch classes");
  }
}

export async function getClassById(id: string) {
  try {
    const [classData] = await db
      .select()
      .from(classesTable)
      .where(eq(classesTable.id, id))
      .limit(1);

    if (!classData) {
      return makeActionError("Class not found");
    }

    return makeActionSuccess(classData);
  } catch (error) {
    console.error("Error fetching class:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to fetch class");
  }
}
