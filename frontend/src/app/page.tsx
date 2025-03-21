import { CRMA } from "@/data/CRMA";
import { CRMB } from "@/data/CRMB";
import { parseCRMBCSV } from "@/services/parseCSV";
import { parseJson } from "@/services/parseJson";

export default function Home() {
  const deals = [...parseJson(CRMA), ...parseCRMBCSV(CRMB)];
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
                  </tr>
                ))}
              </tbody>
              {/* <tfoot>
                <tr className="bg-slate-100 font-semibold">
                  <td className="border px-4 py-2" colSpan={1}>
                    Total
                  </td>
                  <td className="border px-4 py-2">${totalSales.toFixed(2)}</td>
                  <td className="border px-4 py-2" colSpan={2}></td>
                </tr>
              </tfoot> */}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
