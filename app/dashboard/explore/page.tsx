import { redirect } from 'next/navigation';
import { getAllStrategies } from "./_actions";
import StrategyExplorer from "./_components/StrategyExplorer";

const ExplorePage = async () => {
  try {
    const strategies = await getAllStrategies();

    return (
      <div className="container max-w-6xl mx-auto p-4">
        <StrategyExplorer strategies={strategies?.data} />
      </div>
    );
  } catch (error:any) {
    if (error.message === 'No token found' || error.message === 'Authentication required') {
      redirect('/'); 
    }
    // Handle other errors
    console.error('Failed to fetch strategies:', error);
    return <div>Error loading strategies. Please try again later.</div>;
  }
};

export default ExplorePage;