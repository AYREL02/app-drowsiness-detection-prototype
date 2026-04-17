"use client";

import Image from 'next/image';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl h-125 bg-[#e0e5ec] rounded-[50px] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] overflow-hidden p-6 gap-6">
        
        {/* Left Side: Image Container (Inset/Sunken effect) */}
        <div className="relative flex-1 rounded-[40px] bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center overflow-hidden">
          <div className="relative w-3/4 h-3/4 rounded-3xl overflow-hidden shadow-[9px_9px_16px_#bebebe,-9px_-9px_16px_#ffffff]">
            <Image 
              src="/logo/logo.png" 
              alt="Visual Content"
              fill
              className="object-cover"
              priority 
            />
          </div>
        </div>

        {/* Right Side: Navigation Content (Raised effect) */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#31344b]">Drowsiness Detection Prototype</h1>
            <p className="text-gray-500 text-sm px-8 leading-relaxed">
              Real-time fatigue monitoring. Click below to initialize the detection system.
            </p>
          </div>

          <Link 
            href="/wakesync"
            className={`
              px-10 py-4 bg-[#e0e5ec] text-[#31344b] font-semibold rounded-2xl 
              shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]
              transition-all duration-200 
              hover:text-blue-600
              active:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]
              active:scale-95
              inline-block
            `}
          >
            Get Started
          </Link>

          {/* Copyright Section */}
          <div className="pt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              © {new Date().getFullYear()} ARILX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;