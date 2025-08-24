import HydratedClasses from "../hydratedClasses";
import MainClassSchedulesPage from "./components/main";

const ClassSchedulesPage = () => {
  return (
    <HydratedClasses>
      <div className="bg-background text-foreground">
        <MainClassSchedulesPage />
      </div>
    </HydratedClasses>
  );
};

export default ClassSchedulesPage;
