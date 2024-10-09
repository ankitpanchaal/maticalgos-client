import { getAllStrategies } from "./_actions";
import StrategyExplorer from "./_components/StrategyExplorer";

const ExplorePage = async () => {
  const strategies = await getAllStrategies();

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <StrategyExplorer strategies={strategies?.data} />
    </div>
  );
};

export default ExplorePage;

