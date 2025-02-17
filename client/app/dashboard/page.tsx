import Header from './components/Header';
import CardContainer from './components/SmallCardContainer';
import Title from './components/Title';
import Tools from './Tools';
import WalletCard from './components/WalletCard';
import DiscoverPlaces from './components/DiscoverPlaces';
import SubscriptionStatus from './components/SubscriptionStatus';

export default function Page() {
  return (
    <div className="w-full h-screen mb-32 bg-white px-4 pt-4">
      <Header />
      <Title />
      <CardContainer/>
      <Tools />
      <WalletCard />
      <DiscoverPlaces />
    </div>
  );
}
