import { getClasses } from "@/actions/classes";
import { useQuery } from "@tanstack/react-query";

const useClassesQuery = () => {
  const classesQueryData = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const result = await getClasses();

      if (!result.success) {
        throw new Error(result.error || "Failed to load classes");
      }

      return result.data;
    },
  });
  return classesQueryData;
};

export default useClassesQuery;
