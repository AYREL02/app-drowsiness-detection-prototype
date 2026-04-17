"use client";

import Navbar from "@/components/navbar/navbar";

const EvaluationPage = () => {
  const metrics = [
    { title: "Accuracy", src: "performance/accuracy-curve.png" },
    { title: "Loss", src: "performance/loss-curve.png" },
    { title: "Confusion Matrix", src: "performance/confusion-matrix.png" },
    { title: "Classification Report", src: "performance/classification-report.png" },
  ];

  return (
    <div className="h-screen bg-[#e0e5ec] flex flex-col items-center overflow-hidden text-black font-sans">
      <Navbar />

      <div className="pt-32 pb-8 px-8 text-center shrink-0">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-[0.2em]">
          Model Evaluation
        </h1>
        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">
          Performance Metrics & Training Analysis
        </p>
      </div>

      {/* Main scrollable area */}
      <div className="w-full flex-1 overflow-y-auto px-4 md:px-10 pb-24 custom-scrollbar">
        
        {/* 1 ROW, 4 COLUMNS:
          - lg:grid-cols-4 keeps them in one line on large screens.
          - max-w-[95%] ensures the cards utilize the full width of the monitor.
          - Gap reduced slightly to 8 to prevent overflow.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-[95%] mx-auto pt-10">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center p-6 rounded-[2.5rem] bg-[#e0e5ec] shadow-[12px_12px_24px_#bec3c9,-12px_-12px_24px_#ffffff] transition-transform hover:scale-[1.01]"
            >
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-slate-700 text-center">
                {metric.title}
              </h3>
              
              {/* SQUARE GRAPH CONTAINER:
                - Reduced padding (p-4) to maximize the image size inside the card.
              */}
              <div className="w-full aspect-square bg-[#e0e5ec] rounded-2xl p-4 shadow-[inset_6px_6px_12px_#bec3c9,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center overflow-hidden">
                <img 
                  src={metric.src} 
                  alt={metric.title}
                  className="mix-blend-multiply opacity-90 w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationPage;