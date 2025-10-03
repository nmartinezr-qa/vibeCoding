import DashboardContent from "./dashboard-content";

export default function Dashboard(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DashboardContent searchParams={props.searchParams} />;
}
