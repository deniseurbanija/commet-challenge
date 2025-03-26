"use client";
import { CRMA } from "@/data/CRMA";
import { CRMB } from "@/data/CRMB";
import { Deal } from "@/types/deal";
import { transformCRMData } from "@/utils/crmTransformer";
import { useEffect, useState } from "react";

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [totalCommissions, setTotalCommissions] = useState(0);

  useEffect(() => {
    const transformedDeals = transformCRMData(CRMA, CRMB);
    setDeals(transformedDeals);

    const total = transformedDeals.reduce(
      (sum, deal) => sum + deal.commission,
      0
    );
    setTotalCommissions(total);
  }, []);
  return (
    <div className="min-h-screen text-black bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">CRM Data Parse</h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Datos de ventas recientes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Monto</th>
                  <th className="border px-4 py-2 text-left">Vendedor</th>
                  <th className="border px-4 py-2 text-left">Fecha</th>
                  <th className="border px-4 py-2 text-left">Comisión</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50">
                    <td className="border px-4 py-2">{deal.id}</td>
                    <td className="border px-4 py-2">${deal.amount * 0.1}</td>
                    <td className="border px-4 py-2">{deal.salesperson}</td>
                    <td className="border px-4 py-2">
                      {new Date(deal.date).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">${deal.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-right mr-1">
              <h2 className="text-xl font-bold">
                Total Comisiones: ${totalCommissions.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
