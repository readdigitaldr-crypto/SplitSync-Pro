import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  CalendarDays,
  MapPin,
  Search,
  UserCircle,
  Users,
} from "lucide-react";
import { api, listFromResponse } from "../api/client";
import { Card } from "../components/ui/Card";
import { SpendingCharts } from "../components/charts/SpendingCharts";
import type { Trip, User } from "../types";

type Friend = { id: string; friend: User; created_at: string };
type Notification = { id: string; title: string; message: string; read_at?: string };

function useApiList<T>(key: string[], url: string) {
  return useQuery({
    queryKey: key,
    queryFn: async () => listFromResponse<T>((await api.get(url)).data),
  });
}

export function TripsPage() {
  const { data = [], isLoading, isError } = useApiList<Trip>(["trips"], "/trips/");
  return (
    <Page
      eyebrow="Travel ledger"
      title="Trips"
      description="Organize each journey, invite friends, and keep balances transparent."
    >
      <Status loading={isLoading} error={isError} empty={!data.length} emptyText="No trips yet. Create a trip from the API or admin panel to see it here." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.map((t) => (
          <Card key={t.id} className="group overflow-hidden p-0">
            <div className="h-28 bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-amber-300" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black">{t.name}</h2>
                  <p className="mt-1 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <MapPin size={16} /> {t.destination || "Destination pending"}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                  {t.status}
                </span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <Info icon={<CalendarDays size={16} />} label="Dates" value={`${t.start_date} → ${t.end_date}`} />
                <Info icon={<Users size={16} />} label="Members" value={`${t.members?.length ?? 0} people`} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}
export function FriendsPage() {
  const { data = [], isLoading, isError } = useApiList<Friend>(["friends"], "/friends/");
  return (
    <Page eyebrow="Network" title="Friends" description="People you split with most often, synced directly from the friends API.">
      <Status loading={isLoading} error={isError} empty={!data.length} emptyText="No friends found yet." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((f) => (
          <Card key={f.id} className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300">
              <UserCircle />
            </div>
            <div>
              <h2 className="font-bold">{f.friend.full_name || f.friend.username}</h2>
              <p className="text-sm text-slate-500">{f.friend.email}</p>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}
export function ReportsPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["reports"], queryFn: async () => (await api.get("/reports/")).data });
  const chart = (data?.by_category ?? []).map((x: any) => ({ name: x.category, total: Number(x.total) }));
  return (
    <Page eyebrow="Insights" title="Reports" description="Category, member, and monthly spend breakdowns from your expense API.">
      <Status loading={isLoading} error={isError} empty={!chart.length} emptyText="Add expenses to unlock charts." />
      {!!chart.length && <Card><SpendingCharts data={chart} /></Card>}
    </Page>
  );
}
export function NotificationsPage() {
  const { data = [], isLoading, isError } = useApiList<Notification>(["notifications"], "/notifications/");
  return (
    <Page eyebrow="Activity" title="Notifications" description="Friend requests, invitations, and settlements appear here as soon as the API emits them.">
      <Status loading={isLoading} error={isError} empty={!data.length} emptyText="You're all caught up." />
      {data.map((n) => (
        <Card key={n.id} className="flex gap-4">
          <div className="mt-1 text-indigo-500"><Bell /></div>
          <div><b>{n.title}</b><p className="mt-1 text-slate-600 dark:text-slate-300">{n.message}</p></div>
        </Card>
      ))}
    </Page>
  );
}
export function ProfilePage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["profile"], queryFn: async () => (await api.get("/auth/profile/")).data });
  return (
    <Page eyebrow="Account" title="Profile" description="Your authenticated user record from /auth/profile/.">
      <Status loading={isLoading} error={isError} empty={!data} emptyText="Profile unavailable." />
      {data && <Card className="max-w-2xl"><div className="flex items-center gap-5"><div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white"><UserCircle size={42}/></div><div><h2 className="text-2xl font-black">{data.full_name || data.username}</h2><p className="text-slate-500">{data.email}</p><p className="mt-2 text-sm font-semibold">Preferred currency: {data.preferred_currency}</p></div></div></Card>}
    </Page>
  );
}
function Page({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <section><div className="mb-8 rounded-[2rem] bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-8 text-white shadow-2xl"><p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-200">{eyebrow}</p><h1 className="mt-3 text-4xl font-black md:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-slate-300">{description}</p></div><div className="space-y-5">{children}</div></section>;
}
function Status({ loading, error, empty, emptyText }: { loading: boolean; error: boolean; empty: boolean; emptyText: string }) {
  if (loading) return <Card className="animate-pulse">Loading fresh API data…</Card>;
  if (error) return <Card className="border-red-200 bg-red-50/80 text-red-700 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-200">Unable to load this API. Please check authentication and server status.</Card>;
  if (empty) return <Card className="text-slate-500"><Search className="mb-3" />{emptyText}</Card>;
  return null;
}
function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800/70"><div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">{icon}{label}</div><p className="mt-1 font-semibold">{value}</p></div>;
}
