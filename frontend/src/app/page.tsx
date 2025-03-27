"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/service/api";
import { Deal } from "@/types/deal";
import { Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FloatingPaths } from "@/components/floating-path";

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const [dealsData, total] = await Promise.all([
        api.getDeals(),
        api.getTotalCommissions(),
      ]);
      setDeals(dealsData);
      setTotalCommissions(total);
    } catch (err) {
      setError("Error al cargar los deals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  // Animación para el título
  const title = "Commet - Deals";
  const words = title.split(" - ");

  return (
    <div className="min-h-screen text-[#0f172a] bg-white relative overflow-hidden">
      {/* Fondo con caminos animados */}
      <div className="absolute inset-0 opacity-30">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 p-6 md:p-10">
        <div className="max-w-6xl font-light mx-auto space-y-8 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center text-center space-y-2 mt-10">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="text-6xl font-medium tracking-widest"
            >
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-2 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block text-transparent bg-clip-text 
                                bg-gradient-to-r from-[#0f172a] to-[#334155]"
                    >
                      {letter}
                    </motion.span>
                  ))}
                  {wordIndex === 0 && " - "}
                </span>
              ))}
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-medium">Recent Sales Data</h2>
              <Link href="/import">
                <Button className="flex items-center gap-2 bg-[#0f172a] text-white hover:bg-[#1e293b] transition-all duration-300 shadow-md hover:shadow-lg">
                  <Upload className="h-4 w-4" />
                  <span>Import Data</span>
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left font-medium">ID</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Salesperson
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Commission
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground ">
                  {deals.map((deal) => (
                    <motion.tr
                      key={deal.id}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <td className="border-b border-gray-200 px-4 py-3">
                        {deal.id}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-3">
                        ${deal.amount.toLocaleString()}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-3">
                        {deal.salesperson}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-3">
                        {new Date(deal.date).toLocaleDateString()}
                      </td>
                      <td className="border-b border-gray-200 px-4 py-3">
                        ${deal.commission.toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-6 text-right mr-1"
            >
              <div className="inline-block group relative bg-gradient-to-b from-[#0f172a]/10 to-white/10 p-px rounded-lg backdrop-blur-sm overflow-hidden shadow-md">
                <h2 className="text-xl font-medium px-4 py-2 bg-white/90 rounded-lg">
                  Total Commissions:{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f172a] to-[#334155]">
                    ${totalCommissions.toLocaleString()}
                  </span>
                </h2>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
