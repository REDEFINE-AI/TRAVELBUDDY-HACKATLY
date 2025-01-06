import React from "react";
import Segment from "../components/Segment";

export default function Page() {
  return (
    <>
      <section className="w-full h-screen bg-white px-4 pt-4">
        <div className="flex items-center justify-center">
          <Segment tabValues={["English", "Spanish"]} />
        </div>
      </section>
    </>
  );
}
