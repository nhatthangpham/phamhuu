"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

interface LandingHeroProps {
  siteName: string;
}

export default function LandingHero({ siteName }: LandingHeroProps) {
  return (
    <>
      <motion.div
        className="max-w-5xl text-center space-y-12 w-full relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div
          className="space-y-6 sm:space-y-8 flex flex-col items-center"
          variants={fadeIn}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-amber-800 bg-white/60 backdrop-blur-md rounded-full shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] border border-amber-200/50 relative overflow-hidden group"
          >
            <Sparkles className="size-4 text-amber-500" />
            Nền tảng gia phả hiện đại & bảo mật
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-serif font-bold text-stone-900 tracking-tight leading-[1.1] max-w-4xl">
            <span className="block">{siteName}</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-light">
            Gìn giữ và lưu truyền những giá trị, cội nguồn và truyền thống tốt
            đẹp của dòng họ Phạm Hữu cho các thế hệ mai sau.
          </p>
        </motion.div>

        <motion.div
          className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 sm:px-0 relative"
          variants={fadeIn}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-16 bg-amber-500/30 blur-2xl rounded-full z-0 hidden sm:block"></div>

          {/* NÚT ĐĂNG NHẬP */}
          <Link
            href="/login"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg font-bold text-white bg-stone-900 border border-stone-800 hover:bg-stone-800 hover:border-stone-700 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-3">
              Đăng nhập xem sơ đồ
              <ArrowRight className="size-5 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </Link>

          {/* NÚT PHẢ KÝ - QUAN TRỌNG NHẤT */}
          <Link
            href="/phaky"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg font-bold text-stone-900 bg-white border border-stone-200 hover:bg-stone-50 hover:border-stone-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto relative"
          >
            <span className="relative z-10 flex items-center gap-3">
              <BookOpen className="size-5 text-amber-700" />
              Đọc Phả Ký (Ebook)
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}
