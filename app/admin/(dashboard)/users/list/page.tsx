import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { UsersListFilters } from "@/components/admin/users/UsersListFilters";
import { getUsersList } from "@/lib/api/users";

function formatBoolean(value: boolean, trueLabel: string, falseLabel: string) {
  return value ? trueLabel : falseLabel;
}

type SearchParams = Promise<{ page?: string; search?: string }>;

export default async function UsersListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, search } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const searchValue = search?.trim() || "";

  const usersResult = await getUsersList({
    page: currentPage,
    per_page: 20,
    search: searchValue || undefined,
  });

  const { items: users, pagination } = usersResult;

  const startItem = pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.perPage + 1;
  const endItem = Math.min(pagination.currentPage * pagination.perPage, pagination.total);
  const pageLinks = Array.from({ length: pagination.lastPage }, (_, idx) => idx + 1);
  const getPageHref = (pageNumber: number) => {
    const query = new URLSearchParams();
    query.set("page", String(pageNumber));

    if (searchValue) {
      query.set("search", searchValue);
    }

    return `/admin/users/list?${query.toString()}`;
  };

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title=""
        breadcrumbs={[{ label: "Home", href: "/admin" }, { label: "Users" }]}
      />

      <Card>
        <CardContent className="p-0">
          <UsersListFilters
            initialSearch={searchValue}
            title="Users"
            action={(
              <Link href="/admin/users/add">
                <Button>
                  <Plus size={16} />
                  Add User
                </Button>
              </Link>
            )}
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-270 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Manage News</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 text-slate-600">#{user.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-slate-600">{user.phone || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{user.role_name || user.role_id || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{formatBoolean(user.is_active, "Active", "Inactive")}</td>
                    <td className="px-6 py-4 text-slate-600">{formatBoolean(user.can_manage_news, "Yes", "No")}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          <Pencil size={14} />
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {users.length === 0 ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-slate-500" colSpan={8}>
                      No users found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <p className="text-sm text-slate-500">
              Showing {startItem}-{endItem} of {pagination.total}
            </p>

            <div className="flex items-center gap-2">
              <Link
                href={getPageHref(Math.max(1, pagination.currentPage - 1))}
                aria-disabled={pagination.currentPage <= 1}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  pagination.currentPage <= 1
                    ? "pointer-events-none bg-slate-100 text-slate-400"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Prev
              </Link>

              {pageLinks.map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={getPageHref(pageNumber)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    pageNumber === pagination.currentPage
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {pageNumber}
                </Link>
              ))}

              <Link
                href={getPageHref(Math.min(pagination.lastPage, pagination.currentPage + 1))}
                aria-disabled={pagination.currentPage >= pagination.lastPage}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  pagination.currentPage >= pagination.lastPage
                    ? "pointer-events-none bg-slate-100 text-slate-400"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
