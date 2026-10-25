import { redirect } from "next/navigation";
import { Wallet } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getPageVisibility, getTransactions } from "@/lib/queries";
import { canManage, canView } from "@/lib/types";
import { isAdminVisible } from "@/lib/pages";
import {
  AdminPageHeader,
  AdminCard,
  Unauthorized,
} from "@/components/admin/AdminPage";
import { TransactionForm } from "@/components/admin/extra-forms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui";
import { deleteTransaction } from "@/app/actions/finance";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function money(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function AdminFinancePage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  // Department & Association admins can view the ledger; only the Finance
  // Admin and the Super Admin may change it.
  if (!canView(session.role, "finance")) {
    return <Unauthorized section="finance" />;
  }

  const visibility = await getPageVisibility();
  if (!isAdminVisible(visibility, "finance")) {
    return <Unauthorized section="finance" />;
  }

  const transactions = await getTransactions();
  const canEdit = canManage(session.role, "finance");

  const income = transactions
    .filter((item) => item.kind === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const expense = transactions
    .filter((item) => item.kind === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const balance = income - expense;

  return (
    <>
      <AdminPageHeader
        title="Finance"
        description="The department finance ledger. This page is private — it is never shown on the public website."
        action={
          canEdit ? undefined : (
            <Badge tone="muted">View only</Badge>
          )
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            Total income
          </div>
          <div className="mt-1 font-display text-2xl font-semibold text-emerald-600">
            {money(income)}
          </div>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            Total expense
          </div>
          <div className="mt-1 font-display text-2xl font-semibold text-red-600">
            {money(expense)}
          </div>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            Balance
          </div>
          <div className="mt-1 font-display text-2xl font-semibold text-brand-700">
            {money(balance)}
          </div>
        </div>
      </div>

      {canEdit ? (
        <AdminCard title="Add a transaction">
          <TransactionForm />
        </AdminCard>
      ) : (
        <div className="mb-8 rounded-2xl border border-ink-100 bg-ink-50 p-5 text-sm text-ink-600">
          You have read-only access to the finance ledger. Only the Finance
          Admin and the Super Admin can add, edit or delete transactions.
        </div>
      )}

      <div className="mt-8 space-y-4">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Transactions ({transactions.length})
        </h2>

        {transactions.length === 0 ? (
          <p className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-100 bg-white px-5 py-10 text-center text-sm text-ink-500">
            <Wallet className="h-4 w-4" />
            No transactions recorded yet.
          </p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      tone={transaction.kind === "income" ? "brand" : "gold"}
                    >
                      {transaction.kind === "income" ? "Income" : "Expense"}
                    </Badge>
                    <span className="font-semibold text-ink-900">
                      {transaction.title}
                    </span>
                    <span
                      className={
                        transaction.kind === "income"
                          ? "font-display font-semibold text-emerald-600"
                          : "font-display font-semibold text-red-600"
                      }
                    >
                      {transaction.kind === "income" ? "+" : "−"}
                      {money(Number(transaction.amount))}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-ink-500">
                    {[
                      formatDate(transaction.transaction_date),
                      transaction.category,
                      transaction.reference,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                  {transaction.description ? (
                    <p className="mt-2 text-sm text-ink-600">
                      {transaction.description}
                    </p>
                  ) : null}
                </div>
                {canEdit ? (
                  <DeleteButton
                    action={deleteTransaction}
                    id={transaction.id}
                    confirmMessage={`Delete "${transaction.title}"?`}
                  />
                ) : null}
              </div>

              {canEdit ? (
                <details className="mt-4 border-t border-ink-100 pt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-brand-600">
                    Edit transaction
                  </summary>
                  <div className="mt-4">
                    <TransactionForm transaction={transaction} />
                  </div>
                </details>
              ) : null}
            </div>
          ))
        )}
      </div>
    </>
  );
}
