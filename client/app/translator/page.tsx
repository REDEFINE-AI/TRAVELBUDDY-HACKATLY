// 'use client';
// import useAudioRecorder from '@/hooks/audio-player';
// import axios from 'axios';
// import { useActionState, useEffect, useRef, useState } from 'react';
// import { FaMicrophone, FaDownload } from 'react-icons/fa6';
// import { LuAudioLines } from 'react-icons/lu';

// export default function Page() {


//   // const {
//   //   isRecording,
//   //   audioFile,
//   //   error: audioError,
//   //   startRecording,
//   //   stopRecording,
//   //   pauseRecording,
//   //   resumeRecording,
//   //   createDownloadableFile,
//   // } = useAudioRecorder();



//   return (
//     <>
//       <section className="w-full h-screen bg-white px-4 pt-4">
//         <div className="grid place-items-center justify-center h-full w-full">
//           <div className="flex flex-col items-center gap-4">
//             {isRecording ? (
//               <p className="text-lg text-slate-700">Identifying language....</p>
//             ) : (
//               <p className="text-lg text-slate-700">Record Your Audio</p>
//             )}
//             <div
//               className={`flex  w-full h-full text-[5rem] ${
//                 isRecording ? 'animate-pulse text-teal-700' : 'text-teal-700 opacity-40'
//               }`}
//             >
//               <LuAudioLines />
//               <LuAudioLines />
//               <LuAudioLines />
//             </div>
//           </div>
//           <div className=" flex flex-col items-center gap-5">
//             <button
//               type="button"
//               className="flex shrink-0 justify-center items-center gap-2 text-3xl font-medium size-20 bg-teal-600  rounded-full hover:bg-teal-700  border-teal-400 border border-transparent  text-white  disabled:opacity-50 disabled:pointer-events-none"
//               onClick={() => startRecording()}
//               {...(isRecording && { disabled: true })}
//             >
//               <FaMicrophone />
//             </button>

//             <button
//               type="button"
//               className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-300 bg-white text-teal-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-teal-500"
//               {...(!isRecording && { disabled: true })}
//               onClick={() => {
//                 stopRecording();
//                 console.log(audioFile);
//               }}
//             >
//               Stop recording
//             </button>

//             {/* Audio Preview and Download Section */}
//             {audioFile.url && (
//               <div className="flex flex-col items-center gap-4 mt-4">
//                 <audio src={audioFile.url} controls className="w-full max-w-md" />

//                 <button
//                   onClick={() => {
//                     const downloadable = createDownloadableFile();
//                     if (!downloadable) return;

//                     const downloadLink = document.createElement('a');
//                     downloadLink.href = downloadable.url!;
//                     downloadLink.download = downloadable.name;
//                     document.body.appendChild(downloadLink);
//                     downloadLink.click();
//                     document.body.removeChild(downloadLink);
//                   }}
//                   className="py-2 px-4 flex items-center gap-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
//                 >
//                   <FaDownload />
//                   <span>Download Recording</span>
//                   {audioFile.size && (
//                     <span className="text-sm">({(audioFile.size / 1024).toFixed(2)} KB)</span>
//                   )}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
