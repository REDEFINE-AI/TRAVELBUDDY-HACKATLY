import Link from "next/link";
import React from "react";
import { MdOutlineArrowOutward } from "react-icons/md";
import { MdTranslate } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { RiGeminiFill } from "react-icons/ri";

type Props = {};

export default function Tools({}: Props) {
  return (
    <div className="mt-4 ">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-black font-medium">AI Travel Tools</h2>
        <Link
          href="/ai-travel-tools"
          className="text-[.7rem]    flex items-center justify-center gap-1 text-orange-500 font-medium hover:underline"
        >
          View All <MdOutlineArrowOutward />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        {/* Card 1 - Live Translator */}
        <Link href="" className="bg-teal-600 rounded-lg p-4 flex items-center space-x-4 transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
          <div className="relative">
            <div className="absolute -top-2 -right-2 bg-teal-800 p-[.150rem] rounded-full">
              <RiGeminiFill className="text-white text-xss  " />
            </div>
            <MdTranslate className="text-white text-xl" />
          </div>
          <div className="text-white text-xs    font-medium">
            Live Translator
          </div>
        </Link>

        {/* Card 2 - AR Explorer */}
        <Link href="" className="bg-teal-600 rounded-lg p-4 flex items-center space-x-4 transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
          <div className="relative">
            <div className="absolute -top-2 -right-2 bg-teal-800 p-[.150rem] rounded-full">
              <RiGeminiFill className="text-white text-xss  " />
            </div>
            <TbWorld className="text-white text-xl" />
          </div>
          <div className="text-white text-xs    font-medium">
            AR Explorer
          </div>
        </Link>
      </div>
    </div>
  );
}
