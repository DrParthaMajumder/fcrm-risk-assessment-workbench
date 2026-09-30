import { ApplicationDetail } from "@/components/detail/ApplicationDetail";

export default async function ApplicationPage({
  params,
}: PageProps<"/applications/[id]">) {
  const { id } = await params;
  return <ApplicationDetail id={id} />;
}
