import Header from "./components/Header";
import CardContainer from "./components/SmallCardContainer";
import Title from "./components/Title";
import Tools from "./Tools";

 
export default function page(  ) {
  return (
    <div className="w-full h-screen bg-white px-4 pt-4">
      <Header />
      <Title/>
      <CardContainer/>
      <Tools/>
    </div>
  );
}
