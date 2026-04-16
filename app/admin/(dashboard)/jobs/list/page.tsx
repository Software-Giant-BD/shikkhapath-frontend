import Link from "next/link";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Card } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { getJobsList } from "@/lib/api/jobs";

export default async function JobsListPage() {
  const { items: jobs } = await getJobsList({ per_page: 50 }, true);

  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Job Circulars"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Jobs" },
        ]}
      />

      <Card className="p-0 overflow-hidden border-slate-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold">Manage Jobs</h2>
          <Link href="/admin/jobs/add">
            <Button size="sm" className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
              <Plus className="h-4 w-4" />
              Add Job
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium">Job Title</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Category & Type</th>
                <th className="px-4 py-3 font-medium">Deadline</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {job.title}
                      <div className="text-xs text-slate-500 font-normal mt-1 flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        <a 
                          href={job.apply_link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="hover:text-blue-600 truncate max-w-[200px] block"
                        >
                          {job.apply_link}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-4">{job.company_name}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-xs text-slate-700 w-fit">
                          {job.category}
                        </span>
                        <span className="inline-block text-xs text-slate-500">
                          {job.job_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-red-600 font-medium">
                      {job.deadline}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${
                        job.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <Link href={`/admin/jobs/${job.id}`}>
                        <Button variant="outline" size="sm" className="h-8 shadow-none text-blue-600 border-blue-200 hover:bg-blue-50">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="h-8 shadow-none text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    No jobs found. Click "Add Job" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
