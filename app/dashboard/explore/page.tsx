import StrategyExplorer from './_components/StrategyExplorer';

const strategies = [
  {
    id: '1',
    name: 'Strategy 1',
    type: 'Intraday',
    marginRequired: 100000,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
  },{
    id:"2",
    name:"Strategy 2",
    type:"Swing",
    marginRequired:200000,
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. "
  }
];

const ExplorePage = () => {
  return <div className="container max-w-6xl mx-auto p-4">
    <StrategyExplorer strategies={strategies} />
  </div>
};

export default ExplorePage;