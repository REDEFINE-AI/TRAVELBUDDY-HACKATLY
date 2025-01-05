import Header from "./components/Header";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="w-full h-screen bg-white">
      <Header />
    </div>
  );
}
