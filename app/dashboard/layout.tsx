import { requireSession } from "@/lib/session";

export default async function DashboardLayout(
  props: LayoutProps<"/dashboard">,
) {
  await requireSession();

  return (
    <>
      {props.children}
      {props["todo-modal"]}
    </>
  );
}
