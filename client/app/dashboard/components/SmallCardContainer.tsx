import React from "react";
import Card from "./Card";
import { MdFlight } from "react-icons/md";
import { TbMapSearch, TbThumbUp } from "react-icons/tb";
import { FaHistory } from "react-icons/fa";
import { IconType } from "react-icons";

const CardContainer: React.FC = () => {
  interface Card {
    icon: IconType;
    title: string;
    customStyle?: string;
  }

  const cards: Card[] = [
    { icon: MdFlight, title: "Upcoming Trips" },
    { icon: TbMapSearch, title: "Destinations" },
    { icon: TbThumbUp, title: "Recommendations", customStyle: "break-all" },
    { icon: FaHistory, title: "Travel History" },
  ];
  return (
    <div className="grid grid-cols-4    gap-2">
      {cards.map((card, index) => (
        <Card
          customStyle={card.customStyle}
          key={index}
          icon={card.icon}
          title={card.title}
          horizontal={false}
        />
      ))}
    </div>
  );
};

export default CardContainer;
