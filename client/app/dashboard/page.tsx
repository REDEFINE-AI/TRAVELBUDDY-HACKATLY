import Header from "./components/Header";
import CardContainer from "./components/SmallCardContainer";
import Title from "./components/Title";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="w-full h-screen bg-white px-4 pt-4">
      <Header />
      <Title/>
      <CardContainer/>
    </div>
  );
}
