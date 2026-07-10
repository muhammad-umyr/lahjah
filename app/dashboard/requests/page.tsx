"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, onSnapshot, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import DashboardNav from "@/components/DashboardNav";
import { STATUS_CONFIG, type RequestStatus } from "@/lib/status";
import { getUserDisplayName } from "@/lib/roles";

interface CopyRequest {
  id: string;
  title: string;
  domain?: string;
  status: RequestStatus;
  createdAt: Timestamp;
  createdBy: string;
}

type SortField = "createdAt" | "domain" | "status";
type SortOrder = "asc" | "desc";

export default function SharedRequestsPage() {
  const [requests, setRequests] = useState<CopyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [creatorNames, setCreatorNames] = useState<Record<string, string>>({});

  // Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return;
    });
    return unsub;
  }, []);

  // Fetch all requests
  useEffect(() => {
    const q = query(collection(db, "copyRequests"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<CopyRequest, "id">) }))
          .filter((r) => r.status !== "draft" && r.status !== "closed");

        setRequests(docs);
        setLoading(false);

        // Fetch creator display names
        const creatorUids = Array.from(new Set(docs.map((d) => d.createdBy).filter(Boolean)));
        if (creatorUids.length > 0) {
          Promise.all(creatorUids.map(async (u) => [u, await getUserDisplayName(u)] as const)).then(
            (pairs) => setCreatorNames(Object.fromEntries(pairs))
          );
        }
      },
      (err) => {
        console.error("[shared requests] Firestore error:", err);
        setLoadError("Could not load requests. Please refresh the page.");
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  // Apply filtering and sorting
  const filteredRequests = requests.filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    // Handle timestamps
    if (aVal instanceof Timestamp) aVal = aVal.toMillis();
    if (bVal instanceof Timestamp) bVal = bVal.toMillis();

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-300">⟷</span>;
    return sortOrder === "asc" ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">All Requests</h1>
          <p className="text-sm text-gray-400 mt-1">
            {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-600">Filter:</span>
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-brand text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            All
          </button>
          {(["submitted", "in_review", "approved", "changes_requested"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-brand text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {STATUS_CONFIG[status].label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-7 h-7 border-[3px] border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : loadError ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-red-100">
            <p className="text-sm text-red-500 font-medium">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Refresh
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-12 h-12 rounded-2xl bg-brand/20 flex items-center justify-center text-ink text-xl mx-auto mb-4">
              ✦
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No requests yet</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              No requests match the current filter.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    <button
                      onClick={() => handleSort("createdAt")}
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                    >
                      Request #
                      <SortIcon field="createdAt" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    <button
                      onClick={() => handleSort("domain")}
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                    >
                      Domain
                      <SortIcon field="domain" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Raised by
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                    >
                      Status
                      <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Date raised
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRequests.map((req) => {
                  const cfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.draft;
                  return (
                    <tr
                      key={req.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/${req.id}`}
                          className="text-sm font-medium text-brand hover:text-brand-dark"
                        >
                          {req.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/${req.id}`} className="hover:text-brand transition-colors">
                          <span className="text-sm text-gray-700">{req.domain || "—"}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/${req.id}`} className="hover:text-brand transition-colors">
                          <span className="text-sm text-gray-700">
                            {creatorNames[req.createdBy] || req.createdBy}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/${req.id}`} className="inline-block">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.classes}`}>
                            {cfg.label}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/${req.id}`} className="hover:text-brand transition-colors">
                          <span className="text-sm text-gray-700">
                            {req.createdAt?.toDate().toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
