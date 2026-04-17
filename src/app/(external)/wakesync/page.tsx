"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { DrowsinessSystem } from "./_components/camera";
import Navbar from "@/components/navbar/navbar";
import {
  Video,
  VideoOff,
  ShieldCheck,
  Activity,
  LoaderCircle,
  Clock,
  Zap,
  Calendar,
  AlertTriangle,
  Cpu,
  Timer,
} from "lucide-react";

export default function WakeSyncDashboard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const systemRef = useRef<DrowsinessSystem | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [prediction, setPrediction] = useState<string>("Standby");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [drowsyCount, setDrowsyCount] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isCameraOn) {
        setSessionSeconds(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isCameraOn]);

  useEffect(() => {
    if (prediction.toLowerCase() === "drowsy") {
      setDrowsyCount(prev => prev + 1);
    }
  }, [prediction]);

  const turnOffCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraOn(false);
    setPrediction("Standby");
    setSessionSeconds(0);
  }, []);

  const turnOnCamera = useCallback(async () => {
    if (isInitializing) return;
    setIsInitializing(true);
    setPrediction("Starting...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          await videoRef.current?.play();
          if (!systemRef.current) {
            const system = new DrowsinessSystem();
            await system.init();
            systemRef.current = system;
          }
          systemRef.current.run(videoRef.current!, (label) => setPrediction(label));
          setIsCameraOn(true);
          setIsInitializing(false);
        };
      }
    } catch (err) {
      console.error(err);
      turnOffCamera();
      setIsInitializing(false);
    }
  }, [isInitializing, turnOffCamera]);

  useEffect(() => {
    return () => turnOffCamera();
  }, [turnOffCamera]);

  const getStatusColor = () => {
    if (!isCameraOn) return "text-slate-500";
    const status = prediction.toLowerCase();
    if (status === "normal") return "text-green-600";
    if (status === "drowsy") return "text-red-600";
    return "text-blue-600";
  };

  const formatSessionTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] flex flex-col items-center justify-center p-4 md:p-8 text-black font-sans overflow-x-hidden">
      <Navbar />

      {/* MAIN GRID: 3 Columns on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4 w-full max-w-7xl items-center">
        
        {/* 1. LEFT COLUMN: Analytics */}
        <div className="flex flex-col gap-6 w-full max-w-xs justify-self-center lg:justify-self-start order-2 lg:order-1">
          <div className="h-24 p-6 rounded-3xl shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff] bg-[#e0e5ec] flex items-center gap-4 lg:translate-x-8">
            <div className="p-3 rounded-2xl shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]">
              <AlertTriangle size={20} className={drowsyCount > 0 ? "text-red-500" : "text-slate-600"} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Alerts Detected</p>
              <p className="text-sm font-mono font-bold uppercase">{drowsyCount} Events</p>
            </div>
          </div>

          <div className="h-24 p-6 rounded-3xl shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff] bg-[#e0e5ec] flex items-center gap-4">
            <div className="p-3 rounded-2xl shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]">
              <Timer size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Session Time</p>
              <p className="text-sm font-mono font-bold">{formatSessionTime(sessionSeconds)}</p>
            </div>
          </div>

          <div className="h-24 p-6 rounded-3xl shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff] bg-[#e0e5ec] flex items-center gap-4 lg:translate-x-8">
            <div className="p-3 rounded-2xl shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]">
              <Cpu size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">AI Engine</p>
              <p className="text-sm font-mono font-bold uppercase">{isCameraOn ? "32ms / 30FPS" : "Idle"}</p>
            </div>
          </div>
        </div>

        {/* 2. CENTER COLUMN: Camera */}
        <div className="flex flex-col items-center gap-8 md:gap-10 order-1 lg:order-2">
          <div className={`relative w-64 h-64 sm:w-80 sm:h-80 lg:w-105 lg:h-105 bg-[#e0e5ec] rounded-full shadow-[20px_20px_40px_#bec3c9,-20px_-20px_40px_#ffffff] flex flex-col items-center justify-center transition-all border-4 border-[#e0e5ec] z-10 ${isCameraOn ? 'scale-105' : 'scale-100'}`}>
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-90 lg:h-90 rounded-full overflow-hidden shadow-[inset_10px_10px_20px_#bec3c9,inset_-10px_-10px_20px_#ffffff] bg-[#d1d9e6] flex items-center justify-center">
              {!isCameraOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-30 z-10">
                  <VideoOff size={48} className="text-black" />
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-1000 ${isCameraOn ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-5">
            <div className="min-w-35 md:min-w-40 px-6 md:px-10 py-4 md:py-5 rounded-3xl shadow-[inset_6px_6px_12px_#bec3c9,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center gap-3 md:gap-4 bg-[#e0e5ec]">
              <Activity
                size={18}
                className={`transition-all duration-300 ${getStatusColor()} ${
                  isCameraOn && prediction.toLowerCase() === "drowsy" ? "animate-bounce" : isCameraOn ? "animate-pulse" : ""
                }`}
              />
              <span className={`text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-widest ${getStatusColor()}`}>
                {prediction}
              </span>
            </div>

            <button
              onClick={() => (isCameraOn ? turnOffCamera() : turnOnCamera())}
              disabled={isInitializing}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all active:shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff] disabled:opacity-50
                ${isCameraOn 
                  ? "shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff] bg-[#e0e5ec]" 
                  : "shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff] bg-[#e0e5ec] hover:scale-110"
                }`}
            >
              {isInitializing ? (
                <LoaderCircle size={22} className="animate-spin text-black" />
              ) : isCameraOn ? (
                <VideoOff size={22} className="text-red-600" />
              ) : (
                <Video size={22} className="text-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* 3. RIGHT COLUMN: System Info */}
        <div className="flex flex-col gap-6 w-full max-w-xs justify-self-center lg:justify-self-end order-3">
          <div className="h-24 p-6 rounded-3xl shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff] bg-[#e0e5ec] flex items-center gap-4 lg:-translate-x-8">
            <div className="p-3 rounded-2xl shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]">
              <Zap size={20} className={isCameraOn ? "text-yellow-500" : "text-slate-600"} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Mode</p>
              <p className="text-sm font-mono font-bold uppercase">{isCameraOn ? "High Precision" : "Efficiency"}</p>
            </div>
          </div>

          <div className="h-24 p-6 rounded-3xl shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff] bg-[#e0e5ec] flex items-center gap-4">
            <div className="p-3 rounded-2xl shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]">
              <Clock size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Local Time</p>
              <p className="text-sm font-mono font-bold">
                {currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="h-24 p-6 rounded-3xl shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff] bg-[#e0e5ec] flex items-center gap-4 lg:-translate-x-8">
            <div className="p-3 rounded-2xl shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff]">
              <Calendar size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Date</p>
              <p className="text-sm font-mono font-bold uppercase">
                {`${currentTime.getDate().toString().padStart(2, '0')}/${(currentTime.getMonth() + 1).toString().padStart(2, '0')}/${currentTime.getFullYear()}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}