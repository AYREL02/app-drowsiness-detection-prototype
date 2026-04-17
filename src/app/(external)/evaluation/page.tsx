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

      {/* Increased px-20 to provide a "safety gutter" for the shadows */}
      <div className="w-full flex-1 overflow-y-auto px-20 pb-24 custom-scrollbar">
        
        {/* Added pt-10 here so the top-row shadows don't clip against the header */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-7xl mx-auto pt-10">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center p-8 rounded-[2.5rem] bg-[#e0e5ec] shadow-[12px_12px_24px_#bec3c9,-12px_-12px_24px_#ffffff] transition-transform hover:scale-[1.01]"
            >
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-slate-700 text-center">
                {metric.title}
              </h3>
              
              <div className="w-full bg-[#e0e5ec] rounded-2xl p-4 shadow-[inset_6px_6px_12px_#bec3c9,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center overflow-hidden aspect-square">
                <img 
                  src={metric.src} 
                  alt={metric.title}
                  className="rounded-lg mix-blend-multiply opacity-90 w-full h-full object-contain"
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