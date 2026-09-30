export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6f8]">
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 text-center text-xs font-medium text-slate-300">
        SME Risk Workbench · Secure sign-in
      </div>
      <div className="flex flex-1 items-center justify-center p-4">{children}</div>
    </div>
  );
}
