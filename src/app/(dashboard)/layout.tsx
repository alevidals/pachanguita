import { Header } from "@/components/header";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <main className="container mt-4 flex-1">{children}</main>
    </div>
  );
}
