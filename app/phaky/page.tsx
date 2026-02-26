"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default function PhakyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] selection:bg-amber-200 selection:text-amber-900 relative overflow-hidden">
      {/* Nền Grid và Hiệu ứng màu giống trang Login */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#fef3c7,transparent)] pointer-events-none"></div>

      {/* Nút quay lại Trang chủ giống trang Login */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-stone-500 hover:text-stone-900 font-semibold text-sm transition-all duration-300 group bg-white/60 px-5 py-2.5 rounded-full backdrop-blur-md shadow-sm border border-stone-200 hover:border-stone-300 hover:shadow-md"
      >
        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
        Trang chủ
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10 w-full mt-10">
        <motion.div 
          className="w-full max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Tiêu đề trang trọng */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3.5 bg-white rounded-2xl mb-5 shadow-sm ring-1 ring-stone-100">
              <BookOpen className="size-8 text-amber-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Phả Ký Dòng Họ Phạm Hữu
            </h2>
            <p className="mt-3 text-sm text-stone-500 font-medium tracking-wide">
              Ebook lật trang - Gìn giữ cội nguồn dòng họ
            </p>
          </div>

          {/* Khung Ebook với hiệu ứng bo góc và đổ bóng giống trang Login */}
          <div className="bg-white/70 backdrop-blur-xl p-2 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 overflow-hidden relative" style={{ height: '75vh', minHeight: '500px' }}>
             <iframe 
                src="https://heyzine.com/flip-book/c4c44f0283.html" 
                className="w-full h-full rounded-2xl border-none shadow-inner"
                allowFullScreen
              ></iframe>
          </div>
          
          <p className="mt-6 text-center text-stone-400 text-[13px] italic">
            * Nhấn vào mép trang sách để lật hoặc dùng thanh công cụ phía dưới
          </p>
        </motion.div>
      </div>
    </div>
  );
}
