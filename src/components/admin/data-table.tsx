import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  csv?: (row: T) => string | number;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  pageSizeOptions?: number[];
  exportName?: string;
  onRowClick?: (row: T) => void;
  emptyText?: string;
};

const DEFAULT_SIZES = [10, 20, 30, 50, 100, 500];

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSizeOptions = DEFAULT_SIZES,
  exportName = "export",
  onRowClick,
  emptyText = "No records",
}: Props<T>) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(pageSizeOptions[0]);

  const totalPages = Math.max(1, Math.ceil(data.length / size));
  const current = useMemo(() => data.slice(page * size, page * size + size), [data, page, size]);

  function exportCSV() {
    const headers = columns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(",");
    const rows = data.map((row) =>
      columns
        .map((c) => {
          const v = c.csv ? c.csv(row) : (row as any)[c.key];
          return `"${String(v ?? "").replace(/"/g, '""')}"`;
        })
        .join(","),
    );
    const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    triggerDownload(blob, `${exportName}.csv`);
  }

  function exportPDF() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [columns.map((c) => c.header)],
      body: data.map((row) => columns.map((c) => String(c.csv ? c.csv(row) : (row as any)[c.key] ?? ""))),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [191, 144, 47] },
    });
    doc.save(`${exportName}.pdf`);
  }

  return (
    <div className="bg-card border border-border rounded-md overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Show</span>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="bg-background border border-border px-2 py-1 rounded"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>entries</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="text-xs inline-flex items-center gap-1.5 px-3 py-2 border border-border hover:border-gold hover:text-gold rounded">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button onClick={exportPDF} className="text-xs inline-flex items-center gap-1.5 px-3 py-2 border border-border hover:border-gold hover:text-gold rounded">
            <FileText className="h-3.5 w-3.5" /> PDF
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="text-left px-4 py-3 text-[11px] tracking-[0.14em] uppercase font-semibold text-muted-foreground whitespace-nowrap">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {current.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                  {emptyText}
                </td>
              </tr>
            ) : (
              current.map((row, i) => (
                <tr
                  key={(row as any).id ?? i}
                  onClick={() => onRowClick?.(row)}
                  className={`border-t border-border ${onRowClick ? "cursor-pointer hover:bg-secondary/40" : ""}`}
                >
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 align-top">
                      {c.render ? c.render(row) : (row as any)[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-4 border-t border-border text-xs text-muted-foreground">
        <span>
          Page {page + 1} of {totalPages} · {data.length} total
        </span>
        <div className="flex gap-1">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-border rounded disabled:opacity-40 hover:border-gold"
          >
            <ChevronLeft className="h-3 w-3" /> Prev
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-border rounded disabled:opacity-40 hover:border-gold"
          >
            Next <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
