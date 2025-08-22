import HydratedClasses from "../hydratedClasses";
import MainClassesPage from "./components/main";

const ClassPage = () => {
  return (
    <HydratedClasses>
      <MainClassesPage />
    </HydratedClasses>
  );
};

export default ClassPage;
