"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/service/api";
import { Deal } from "@/types/deal";
import { Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  return (
    <div className="min-h-screen text-[#0f172a] bg-gradient-to-t from-gray-300 to-gray-50 p-6 md:p-10">
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center text-center space-y-2 mt-10">
          <h1 className="text-6xl font-medium tracking-widest">
            Commet - Gestión de Deals
          </h1>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold ">
              Datos de ventas recientes
            </h2>
            <Link href="/import">
              <Button className="flex items-center gap-2 bg-[#0f172a] text-white">
                <Upload className="h-4 w-4" />
                Importar Datos
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto rounded-md">
            <table className="w-full border-collapse ">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Monto</th>
                  <th className="px-4 py-2 text-left">Vendedor</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                  <th className="px-4 py-2 text-left">Comisión</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{deal.id}</td>
                    <td className="border px-4 py-2">${deal.amount}</td>
                    <td className="border px-4 py-2">{deal.salesperson}</td>
                    <td className="border px-4 py-2">
                      {new Date(deal.date).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">${deal.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right mr-1">
            <h2 className="text-xl font-bold">
              Total Comisiones: ${totalCommissions.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
