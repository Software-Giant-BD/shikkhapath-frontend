import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobDetails } from "@/components/customer/jobs/job-details";
import { getJobBySlug } from "@/lib/api/jobs";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Not Found | Shikkhapath",
    };
  }

  return {
    title: `${job.title} at ${job.company_name} | Shikkhapath Jobs`,
    description: job.description?.substring(0, 160) || "Apply for this job on Shikkhapath",
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return <JobDetails job={job} />;
}
