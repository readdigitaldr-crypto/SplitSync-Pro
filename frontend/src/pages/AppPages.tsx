import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { Card } from "../components/ui/Card";
import { SpendingCharts } from "../components/charts/SpendingCharts";
export function TripsPage() {
  const { data } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => (await api.get("/trips/")).data.results ?? [],
  });
  return (
    <Page title="Trips">
      <div className="grid gap-4 md:grid-cols-3">
        {data?.map((t: any) => (
          <Card key={t.id}>
            <h2 className="text-xl font-bold">{t.name}</h2>
            <p>{t.destination}</p>
            <p>
              {t.start_date} → {t.end_date}
            </p>
          </Card>
        ))}
      </div>
    </Page>
  );
}
export function FriendsPage() {
  const { data } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => (await api.get("/friends/")).data.results ?? [],
  });
  return (
    <Page title="Friends">
      {data?.map((f: any) => (
        <Card key={f.id}>{f.friend.full_name || f.friend.username}</Card>
      ))}
    </Page>
  );
}
export function ReportsPage() {
  const { data } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => (await api.get("/reports/")).data,
  });
  const chart = (data?.by_category ?? []).map((x: any) => ({
    name: x.category,
    total: Number(x.total),
  }));
  return (
    <Page title="Reports">
      <SpendingCharts data={chart} />
    </Page>
  );
}
export function NotificationsPage() {
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await api.get("/notifications/")).data.results ?? [],
  });
  return (
    <Page title="Notifications">
      {data?.map((n: any) => (
        <Card key={n.id}>
          <b>{n.title}</b>
          <p>{n.message}</p>
        </Card>
      ))}
    </Page>
  );
}
export function ProfilePage() {
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => (await api.get("/auth/profile/")).data,
  });
  return (
    <Page title="Profile">
      <Card>
        <p>{data?.full_name}</p>
        <p>{data?.email}</p>
      </Card>
    </Page>
  );
}
function Page({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h1 className="mb-6 text-4xl font-black">{title}</h1>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
