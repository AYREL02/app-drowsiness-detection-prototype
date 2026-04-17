"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LogOut, ChartBarBig } from "lucide-react"; // Added ChartBarBig

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <ul className="flex items-center gap-2 px-4 py-2 bg-[#e0e5ec] rounded-full shadow-[8px_8px_16px_#bec3c9,-8px_-8px_16px_#ffffff]">
        
        {/* Logo and Detection Link */}
        <li className="flex items-center">
          <Link 
            href="/wakesync" 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all
              ${pathname === '/wakesync' 
                ? 'shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff] text-blue-600' 
                : 'text-black hover:text-blue-500'}`}
          >
            <ShieldCheck size={14} strokeWidth={3} />
            Detection
          </Link>
        </li>

        {/* Small vertical divider */}
        <div className="w-px h-4 bg-slate-300 mx-1" />

        {/* Evaluation Link */}
        <li>
          <Link 
            href="/evaluation" 
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all
              ${pathname === '/evaluation' 
                ? 'shadow-[inset_4px_4px_8px_#bec3c9,inset_-4px_-4px_8px_#ffffff] text-blue-600' 
                : 'text-black hover:text-blue-500'}`}
          >
            {/* Added Icon for Evaluation */}
            <ChartBarBig size={14} strokeWidth={3} />
            Evaluation
          </Link>
        </li>

        {/* Exit Link */}
        <li>
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider text-black hover:text-red-500 transition-all active:shadow-[inset_4px_4px_8px_#bec3c9]"
          >
            <LogOut size={14} strokeWidth={3} />
          </Link>
        </li>

      </ul>
    </nav>
  );
};

export default Navbar;