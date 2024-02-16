"use client";

import { useState, useRef, useEffect } from "react";
import Waveform from "@/../components/upload/waveform";
import Stats from "@/../components/upload/stats";
import { File, Upload } from "lucide-react";
import AudioSubmit from "@/../components/upload/audio-submit";

export default function TryIt() {
  const [file, setFile] = useState<File | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [file]);

  return (
    <>
      <h1
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
        style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
      >
        Let&apos;s transcribe your <span className="text-green-500">audio</span>
      </h1>
        
      <div>
        <Stats />
      </div>
    </>
    // <div className="container flex w-full flex-col items-center gap-12">
    //   <section className="text-center py-28 max-w-3xl flex flex-col gap-3 items-center w-full">
    //     <div className="text-5xl tracking-tighter font-semibold">
    //       Upload an mp3 file
    //     </div>
    //     {file && (
    //       <div className="flex flex-col items-center w-full gap-2">
    //         <h1 className="pt-12 font-semibold w-full">
    //           <Waveform file={file} />
    //         </h1>
    //         <AudioSubmit file={file} setFile={setFile} />
    //       </div>
    //     )}
    //     <div
    //       onClick={() => fileInputRef.current?.click()}
    //       className="cursor-pointer justify-center"
    //     >
    //       {!file ? (
    //         <div className="my-5 flex gap-2 items-center px-2.5 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-600 bg-gray-100 bg-opacity-40">
    //           <Upload size={20} /> Select a File
    //         </div>
    //       ) : (
    //         <div className="my-5 flex gap-2 items-center px-2.5 py-1.5  rounded-lg border border-dashed border-gray-300 text-gray-600 bg-gray-100 bg-opacity-40">
    //           <File size={20} /> Change File
    //         </div>
    //       )}
    //       <input
    //         ref={fileInputRef}
    //         type="file"
    //         accept=".mp3"
    //         style={{ display: "none" }}
    //         onChange={(e) => setFile(e.target.files?.[0])}
    //       />
    //     </div>
    //   </section>
    // </div>
  );
}
