import HydratedClasses from "../hydratedClasses";
import MainClassSessionsPage from "./components/main";

const ClassSessionsPage = () => {
  return (
    <HydratedClasses>
      <div className="bg-background text-foreground">
        <MainClassSessionsPage />
      </div>
    </HydratedClasses>
  );
};

export default ClassSessionsPage;
