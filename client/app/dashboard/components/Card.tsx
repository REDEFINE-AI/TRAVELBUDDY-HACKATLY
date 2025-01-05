import React from "react";
import { IconType } from "react-icons";
import clsx from "clsx";

interface CardProps {
  icon: IconType;
  title: string;
  subtitle?: string;
  horizontal?: boolean;
  customStyle?:string
}

const Card: React.FC<CardProps> = ({
  icon: Icon,
  title,
  subtitle,
  horizontal = false,
  customStyle
}) => {
  return (
    <div
      className={clsx(
        "flex bg-white p-2 py-2.5 group cursor-pointer hover:bg-teal-500  rounded-lg items-center  gap-2 border border-teal-300",
        horizontal ? "flex-row" : "flex-col"
      )}
    >
      {/* Icon Container */}
      <div className="bg-teal-50 text-teal-500 p-2 rounded-full flex items-center justify-center">
        <Icon size={14} />
      </div>

      {/* Text Content */}
      <div className={clsx("text-center", horizontal && "text-left")}>
        <h3 className={clsx("text-xss font-semibold group-hover:text-white text-teal-800 break-words",customStyle)}>
          {title}
        </h3>

        {subtitle && <p className="text-xs text-teal-600">{subtitle}</p>}
      </div>
    </div>
  );
};

export default Card;
