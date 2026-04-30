import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Calendar, Clock, GraduationCap, Mail, MapPin, Phone, Stethoscope, User, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { getDoctor } from "@/lib/api/admin/doctor-actions";
import { StatusForm } from "./status-form";

export default async function DoctorDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const doctor = await getDoctor(params.id);

  if (!doctor) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 tracking-wide uppercase">Active</span>;
      case "pending":
        return <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold border border-sky-200 tracking-wide uppercase">Pending</span>;
      case "rejected":
        return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold border border-rose-200 tracking-wide uppercase">Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200 tracking-wide uppercase">{status}</span>;
    }
  };

  const profileImg = doctor.profile_image ? (doctor.profile_image.startsWith('http') ? doctor.profile_image : `http://localhost:8000/storage/${doctor.profile_image}`) : null;
  const clinicImg = doctor.clinic_image ? (doctor.clinic_image.startsWith('http') ? doctor.clinic_image : `http://localhost:8000/storage/${doctor.clinic_image}`) : null;

  return (
    <div className="w-full space-y-6 px-4 py-6 md:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <div className="flex items-center gap-4 pb-4 border-b border-slate-200/60">
        <Link href="/admin/doctors/list">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 bg-white shadow-sm border border-slate-200">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Profile</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-slate-500">ID: {doctor.id}</p>
            <span className="text-slate-300">•</span>
            {getStatusBadge(doctor.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-slate-200/60 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-sky-500"></div>
            <CardContent className="pt-0 relative px-6 sm:px-8 pb-8">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="-mt-16 w-32 h-32 rounded-xl bg-white border-4 border-white shadow-md overflow-hidden shrink-0 flex items-center justify-center relative">
                  {profileImg ? (
                    <img src={profileImg} alt={doctor.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-300" />
                  )}
                </div>
                <div className="pt-2 sm:pt-4 flex-1">
                  <h2 className="text-2xl font-bold text-slate-800">{doctor.full_name}</h2>
                  <p className="text-indigo-600 font-medium flex items-center gap-1.5 mt-1">
                    <Stethoscope className="w-4 h-4" />
                    {doctor.specialty}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">BMDC Reg. No</p>
                      <p className="font-semibold text-slate-800">{doctor.bmdc_registration_no}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Phone Number</p>
                      <p className="font-semibold text-slate-800">{doctor.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Email Address</p>
                      <p className="font-semibold text-slate-800">{doctor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">NID / Passport</p>
                      <p className="font-semibold text-slate-800">{doctor.nid_no || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Hospital / Chamber</p>
                      <p className="font-semibold text-slate-800">{doctor.hospital_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">District</p>
                      <p className="font-semibold text-slate-800">{doctor.district?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Available Days</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doctor.available_days?.map((day) => (
                          <span key={day} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">{day}</span>
                        )) || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Time Slot</p>
                      <p className="font-semibold text-slate-800">{doctor.available_time_slot}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">About Doctor</h3>
                <div 
                  className="prose prose-sm max-w-none text-slate-600 bg-slate-50/50 p-4 rounded-lg border border-slate-100"
                  dangerouslySetInnerHTML={{ __html: doctor.description || '<p>No description provided.</p>' }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions & Extra Info */}
        <div className="space-y-6">
          <Card className="border-slate-200/60 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-3">
              <CardTitle className="text-base font-semibold text-slate-800">Status Update</CardTitle>
            </div>
            <CardContent className="p-5">
              <StatusForm 
                doctorId={doctor.id} 
                initialStatus={doctor.status} 
                initialRejectionReason={doctor.rejection_reason} 
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-3">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Clinic Image
              </CardTitle>
            </div>
            <CardContent className="p-5">
              {clinicImg ? (
                <div className="rounded-lg overflow-hidden border border-slate-200">
                  <img src={clinicImg} alt="Clinic" className="w-full h-auto object-cover" />
                </div>
              ) : (
                <div className="h-32 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-sm">No clinic image</span>
                </div>
              )}
              
              <div className="mt-6 space-y-3">
                 <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Consultation Fee</span>
                    <span className="font-bold text-slate-800 text-lg">৳ {doctor.consultation_fee}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Applied On</span>
                    <span className="font-medium text-slate-700">{new Date(doctor.created_at).toLocaleDateString()}</span>
                 </div>
                 {doctor.approved_at && (
                   <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Approved On</span>
                      <span className="font-medium text-slate-700">{new Date(doctor.approved_at).toLocaleDateString()}</span>
                   </div>
                 )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
