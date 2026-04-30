import Link from "next/link";
import { Eye, Search, Stethoscope } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getDoctors } from "@/lib/api/admin/doctor-actions";
import { getDistrictsAction } from "@/lib/api/location-actions";
import { MEDICAL_SPECIALTIES } from "@/lib/constants/specialties";
import { DoctorFilters } from "./filters";

export default async function DoctorsListPage(props: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    district_id?: string;
    specialty?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const statusParam = searchParams.status || "";
  const districtIdParam = searchParams.district_id || "";
  const specialtyParam = searchParams.specialty || "";

  const response = await getDoctors(
    page,
    search,
    statusParam,
    districtIdParam,
    specialtyParam,
  );
  const districtsResult = await getDistrictsAction();
  const districts = districtsResult.items || [];

  const doctors = response?.data || [];
  const meta = response?.meta || { current_page: 1, last_page: 1, total: 0 };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
            Active
          </span>
        );
      case "pending":
        return (
          <span className="px-2.5 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold border border-sky-200">
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold border border-rose-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Doctors Management"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Doctors", href: "/admin/doctors/list" },
          { label: "List" },
        ]}
      />

      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 bg-white pb-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-lg font-semibold text-slate-800">
              Doctors List
            </CardTitle>
            <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full ml-2">
              {meta.total} Total
            </span>
          </div>

          <DoctorFilters specialties={MEDICAL_SPECIALTIES} districts={districts} />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Doctor</th>
                  <th className="px-6 py-4 font-semibold">Specialty</th>
                  <th className="px-6 py-4 font-semibold">City</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">BMDC No</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {doctors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No doctors found.
                    </td>
                  </tr>
                ) : (
                  doctors.map((doctor) => (
                    <tr
                      key={doctor.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border border-slate-200">
                            {doctor.profile_image ? (
                              <img
                                src={
                                  doctor.profile_image.startsWith("http")
                                    ? doctor.profile_image
                                    : `http://localhost:8000/storage/${doctor.profile_image}`
                                }
                                alt={doctor.full_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-indigo-600 font-bold text-sm">
                                {doctor.full_name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                              {doctor.full_name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {doctor.hospital_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700">
                          {doctor.specialty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700">
                          {doctor.district?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span>{doctor.phone_number}</span>
                          <span className="text-xs text-slate-400">
                            {doctor.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        {doctor.bmdc_registration_no}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(doctor.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/doctors/${doctor.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {meta.last_page > 1 && (
            <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex justify-between items-center text-sm text-slate-500">
              <span>
                Showing page {meta.current_page} of {meta.last_page}
              </span>
              <div className="flex gap-2">
                {meta.current_page > 1 && (
                  <Link
                    href={`/admin/doctors/list?page=${meta.current_page - 1}${search ? `&search=${search}` : ""}`}
                  >
                    <Button variant="secondary" size="sm">
                      Previous
                    </Button>
                  </Link>
                )}
                {meta.current_page < meta.last_page && (
                  <Link
                    href={`/admin/doctors/list?page=${meta.current_page + 1}${search ? `&search=${search}` : ""}`}
                  >
                    <Button variant="secondary" size="sm">
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
