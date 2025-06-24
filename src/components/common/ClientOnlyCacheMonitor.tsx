"use client";
import dynamic from "next/dynamic";

const CacheMonitor = dynamic(() => import("./CacheMonitor"), { ssr: false });

export default function ClientOnlyCacheMonitor() {
  return <CacheMonitor />;
} 