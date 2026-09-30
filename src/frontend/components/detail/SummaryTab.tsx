import type { Application } from "@/lib/api/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export function SummaryTab({ application }: { application: Application }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Business">
        <Field label="Business name" value={application.businessName} />
        <Field label="Owner" value={application.ownerName} />
        <Field label="State" value={application.usState} />
        <Field label="Industry" value={application.industry} />
        <Field label="Years in business" value={application.yearsInBusiness} />
        <Field
          label="Ownership"
          value={`${application.ownerOwnershipPercent}%`}
        />
        <Field label="Market condition" value={application.marketCondition} />
        <Field
          label="Dataset label"
          value={application.loanStatus}
        />
      </Card>

      <Card title="Financials">
        <Field label="Annual revenue" value={formatCurrency(application.annualRevenue)} />
        <Field label="Monthly revenue" value={formatCurrency(application.monthlyRevenue)} />
        <Field label="EBITDA" value={formatCurrency(application.ebitda)} />
        <Field label="Operating profit" value={formatCurrency(application.operatingProfit)} />
        <Field
          label="Net profit margin"
          value={formatPercent(application.netProfitMargin)}
        />
        <Field
          label="Operating cash flow"
          value={formatCurrency(application.operatingCashFlow)}
        />
        <Field
          label="Debt to equity"
          value={formatNumber(application.debtToEquityRatio, 2)}
        />
        <Field
          label="Current ratio"
          value={formatNumber(application.currentRatio, 2)}
        />
      </Card>

      <Card title="Owner credit">
        <Field
          label="Monthly income"
          value={formatCurrency(application.ownerMonthlyIncome)}
        />
        <Field label="Credit score" value={application.ownerCreditScore} />
        <Field label="Previous defaults" value={application.previousDefaults} />
      </Card>

      <Card title="Loan request">
        <Field
          label="Amount requested"
          value={formatCurrency(application.loanAmountRequested)}
        />
        <Field label="Purpose" value={application.loanPurpose} />
        <Field
          label="Last loan amount"
          value={formatCurrency(application.lastLoanAmount)}
        />
        <Field
          label="Document verification"
          value={application.documentVerification.replaceAll("_", " ")}
        />
      </Card>
    </div>
  );
}
