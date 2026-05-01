import Link from "next/link";
import { Calendar, Search, User, Phone, MapPin, Clock, Stethoscope } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { getAppointments, getDoctors } from "@/lib/api/admin/doctor-actions";
import { AppointmentStatusUpdate } from "./status-update";
import { AppointmentFilters } from "./filters";
import { MEDICAL_SPECIALTIES } from "@/lib/constants/specialties";

export default async function DoctorAppointmentsPage(props: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    doctor_id?: string;
    date?: string;
    specialty?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const statusParam = searchParams.status || "";
  const doctorIdParam = searchParams.doctor_id || "";
  const dateParam = searchParams.date || "";
  const specialtyParam = searchParams.specialty || "";

  const response = await getAppointments(
    page,
    search,
    statusParam,
    doctorIdParam,
    dateParam,
    specialtyParam,
  );

  const doctorsResponse = await getDoctors(1, "", "active");
  const filterDoctors = (doctorsResponse?.data || []).map(d => ({ id: d.id, name: d.full_name }));

  const appointments = response?.data || [];
  const meta = response?.meta || { current_page: 1, last_page: 1, total: 0 };

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Doctor Appointments"
        breadcrumbs={[
          { label: "Home", href: "/admin" },
          { label: "Doctors", href: "/admin/doctors" },
          { label: "Appointments" },
        ]}
      />

      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 bg-white pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-lg font-semibold text-slate-800">
              Appointments List
            </CardTitle>
            <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full ml-2">
              {meta.total} Total
            </span>
          </div>

          <div className="flex-grow md:max-w-4xl">
            <AppointmentFilters 
              specialties={MEDICAL_SPECIALTIES} 
              doctors={filterDoctors} 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Patient</th>
                  <th className="px-6 py-4 font-semibold">Serial NO</th>
                  <th className="px-6 py-4 font-semibold">Doctor</th>
                  <th className="px-6 py-4 font-semibold">Appointment</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Booking At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Calendar className="w-8 h-8 text-slate-300" />
                        <p className="text-slate-500 font-medium">
                          No appointments found.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">
                            {appointment.full_name}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mt-1 px-2 py-0.5 bg-slate-100 rounded-full w-fit">
                            <User className="w-3 h-3 text-slate-400" /> {appointment.age} Years
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100 shadow-sm">
                          {appointment.serial_number}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 shrink-0 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm leading-tight">
                              {appointment.doctor?.name}
                            </span>
                            <span className="text-[11px] font-medium text-indigo-500 mt-0.5">
                              {appointment.doctor?.specialty}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700 uppercase tracking-tight">
                            {appointment.appointment_day}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />{" "}
                            {appointment.appointment_date}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />{" "}
                            {appointment.phone_number}
                          </span>
                          {appointment.email && (
                            <span className="text-xs text-slate-400 ml-5">
                              {appointment.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <AppointmentStatusUpdate
                          id={appointment.id}
                          currentStatus={appointment.status}
                        />
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-slate-400 italic">
                        {new Date(appointment.created_at).toLocaleDateString()}
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
                    href={`/admin/doctor-appointments?page=${meta.current_page - 1}${search ? `&search=${search}` : ""}`}
                  >
                    <Button variant="secondary" size="sm">
                      Previous
                    </Button>
                  </Link>
                )}
                {meta.current_page < meta.last_page && (
                  <Link
                    href={`/admin/doctor-appointments?page=${meta.current_page + 1}${search ? `&search=${search}` : ""}`}
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
