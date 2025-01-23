import { FaMicrophone } from 'react-icons/fa6';
import { LuAudioLines } from 'react-icons/lu';

export default function Page() {
  return (
    <>
      <section className="w-full h-screen bg-white px-4 pt-4">
        <div className="grid place-items-center justify-center h-full w-full">
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg text-slate-700">Identifying language....</p>
            <div className="flex text-teal-700 w-full h-full text-[5rem]">
              <LuAudioLines />
              <LuAudioLines />
              <LuAudioLines />
            </div>
          </div>
          <div className=" flex flex-col items-center gap-5">
            <button
              type="button"
              className="flex shrink-0 justify-center items-center gap-2 text-3xl font-medium size-20 bg-teal-600  rounded-full hover:bg-teal-700  border-teal-400 border border-transparent  text-white  disabled:opacity-50 disabled:pointer-events-none"
            >
              <FaMicrophone />
            </button>

            <button
              type="button"
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-300 bg-white text-teal-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-teal-500"
            >
              Stop recording
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
