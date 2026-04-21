import "server-only";
import { fetchApi, extractPagination, type BasePagination } from "./common";

export interface AdmissionUniversityModel {
  id: string;
  name: string;
  unit?: string;
  logo_url?: string;
  exam_date: string;
  app_start_date: string;
  app_deadline: string;
  exam_type: "Written" | "MCQ" | "Online" | "Written & MCQ";
  seats: number | string;
  tags: string[];

  // Requirements
  req_ssc: number;
  req_hsc: number;
  req_total: number;
  allowed_groups: string[];
  apply_url: string;
}

export interface AdmissionListResult {
  items: AdmissionUniversityModel[];
  pagination: BasePagination;
}

export interface GetFilters {
  page?: number;
  limit?: number;
}

export async function getAdmissions(params?: GetFilters): Promise<AdmissionListResult> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const query = searchParams.toString();
  const url = query ? `/api/admissions?${query}` : `/api/admissions`;
  
  try {
    const res = await fetchApi(url, { next: { revalidate: 60, tags: ["admissions"] } });
    if (!res.ok) throw new Error("Failed to fetch admissions");
    const json = await res.json();
    return {
      items: (json.data || []).map((item: any) => ({
         ...item,
         id: item.id?.toString() || Math.random().toString()
      })),
      pagination: extractPagination(json, params?.page || 1, params?.limit || 15),
    };
  } catch (err) {
    console.error("API Mock fallback for getAdmissions", err);
    // Return robust mock data for testing Eligibility
    const mockData: AdmissionUniversityModel[] = [
      {
        id: "du-a", name: "University of Dhaka", unit: "A Unit (Science)", exam_date: "2026-03-01", app_start_date: "2026-01-15", app_deadline: "2026-02-15", exam_type: "Written & MCQ", seats: 1851, tags: ["Public", "Top Ranked"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science"], apply_url: "https://admission.eis.du.ac.bd"
      },
      {
        id: "du-b", name: "University of Dhaka", unit: "B Unit (Arts, Law & Social)", exam_date: "2026-03-05", app_start_date: "2026-01-15", app_deadline: "2026-02-15", exam_type: "Written & MCQ", seats: 2934, tags: ["Public", "Top Ranked"], req_ssc: 3.0, req_hsc: 3.0, req_total: 7.5, allowed_groups: ["Science", "Arts", "Commerce"], apply_url: "https://admission.eis.du.ac.bd"
      },
      {
        id: "buet", name: "Bangladesh University of Engineering and Technology", unit: "Engineering", exam_date: "2026-04-10", app_start_date: "2026-01-20", app_deadline: "2026-02-25", exam_type: "Written", seats: 1305, tags: ["Engineering", "Leading"], req_ssc: 4.0, req_hsc: 5.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://ugadmission.buet.ac.bd"
      },
      {
        id: "ju-all", name: "Jahangirnagar University", unit: "General Units", exam_date: "2026-03-25", app_start_date: "2026-02-10", app_deadline: "2026-03-10", exam_type: "MCQ", seats: "1889+", tags: ["Public", "Nature Campus"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://juniv-admission.org"
      },
      {
        id: "cu", name: "University of Chittagong", unit: "All Units", exam_date: "2026-03-22", app_start_date: "2026-01-10", app_deadline: "2026-02-12", exam_type: "MCQ", seats: 4926, tags: ["Public"], req_ssc: 3.5, req_hsc: 3.5, req_total: 7.5, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://admission.cu.ac.bd"
      },
      {
        id: "ru", name: "University of Rajshahi", unit: "All Units", exam_date: "2026-03-20", app_start_date: "2026-02-05", app_deadline: "2026-03-01", exam_type: "MCQ", seats: 4000, tags: ["Public"], req_ssc: 3.5, req_hsc: 3.5, req_total: 7.5, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://admission.ru.ac.bd"
      },
      {
        id: "sust", name: "Shahjalal University of Science and Technology", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 1700, tags: ["Science & Tech", "Cluster"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "ku", name: "Khulna University", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 1200, tags: ["Public", "Cluster"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "iu", name: "Islamic University Bangladesh", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 2300, tags: ["Public", "Cluster"], req_ssc: 3.25, req_hsc: 3.25, req_total: 7.5, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "jnu", name: "Jagannath University", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 2765, tags: ["Public", "Cluster"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "cou", name: "Comilla University", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 1040, tags: ["Public", "Cluster"], req_ssc: 3.0, req_hsc: 3.0, req_total: 6.5, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "nu", name: "National University Bangladesh", unit: "Undergraduate (Honours)", exam_date: "2026-05-10", app_start_date: "2026-04-01", app_deadline: "2026-04-30", exam_type: "Online", seats: "400,000+", tags: ["Public", "National"], req_ssc: 2.5, req_hsc: 2.5, req_total: 6.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://app1.nu.edu.bd"
      },
      {
        id: "bou", name: "Bangladesh Open University", unit: "All Programs", exam_date: "2026-06-01", app_start_date: "2026-03-01", app_deadline: "2026-04-15", exam_type: "Written & MCQ", seats: "Unlimited", tags: ["Public", "Distance Learning"], req_ssc: 2.0, req_hsc: 2.0, req_total: 4.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://osapsnew.bou.ac.bd"
      },
      {
        id: "bsmmu", name: "Bangabandhu Sheikh Mujib Medical University", unit: "Allied Health", exam_date: "2026-05-20", app_start_date: "2026-03-10", app_deadline: "2026-04-10", exam_type: "MCQ", seats: 500, tags: ["Medical", "Public"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://bsmmu.edu.bd"
      },
      {
        id: "cmu", name: "Chittagong Medical University", unit: "MBBS", exam_date: "2026-02-09", app_start_date: "2026-01-11", app_deadline: "2026-01-23", exam_type: "MCQ", seats: "Central DGME", tags: ["Medical", "Public"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://dgme.teletalk.com.bd"
      },
      {
        id: "dmc", name: "Dhaka Medical College", unit: "MBBS", exam_date: "2026-02-09", app_start_date: "2026-01-11", app_deadline: "2026-01-23", exam_type: "MCQ", seats: 230, tags: ["Medical", "Top Ranked"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://dgme.teletalk.com.bd"
      },
      {
        id: "ssmc", name: "Sir Salimullah Medical College", unit: "MBBS", exam_date: "2026-02-09", app_start_date: "2026-01-11", app_deadline: "2026-01-23", exam_type: "MCQ", seats: 230, tags: ["Medical", "Public"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://dgme.teletalk.com.bd"
      },
      {
        id: "ssuhmc", name: "Shaheed Suhrawardy Medical College", unit: "MBBS", exam_date: "2026-02-09", app_start_date: "2026-01-11", app_deadline: "2026-01-23", exam_type: "MCQ", seats: 200, tags: ["Medical", "Public"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://dgme.teletalk.com.bd"
      },
      {
        id: "mmc", name: "Mymensingh Medical College", unit: "MBBS", exam_date: "2026-02-09", app_start_date: "2026-01-11", app_deadline: "2026-01-23", exam_type: "MCQ", seats: 230, tags: ["Medical", "Public"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://dgme.teletalk.com.bd"
      },
      {
        id: "cmc", name: "Chattogram Medical College", unit: "MBBS", exam_date: "2026-02-09", app_start_date: "2026-01-11", app_deadline: "2026-01-23", exam_type: "MCQ", seats: 230, tags: ["Medical", "Public"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://dgme.teletalk.com.bd"
      },
      {
        id: "rmc", name: "Rajshahi Medical College", unit: "MBBS", exam_date: "2026-02-09", app_start_date: "2026-01-11", app_deadline: "2026-01-23", exam_type: "MCQ", seats: 230, tags: ["Medical", "Public"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://dgme.teletalk.com.bd"
      },
      {
        id: "somc", name: "Sylhet MAG Osmani Medical College", unit: "MBBS", exam_date: "2026-02-09", app_start_date: "2026-01-11", app_deadline: "2026-01-23", exam_type: "MCQ", seats: 230, tags: ["Medical", "Public"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://dgme.teletalk.com.bd"
      },
      {
        id: "sbmc", name: "Sher-e-Bangla Medical College", unit: "MBBS", exam_date: "2026-02-09", app_start_date: "2026-01-11", app_deadline: "2026-01-23", exam_type: "MCQ", seats: 230, tags: ["Medical", "Public"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://dgme.teletalk.com.bd"
      },
      {
        id: "rangmc", name: "Rangpur Medical College", unit: "MBBS", exam_date: "2026-02-09", app_start_date: "2026-01-11", app_deadline: "2026-01-23", exam_type: "MCQ", seats: 230, tags: ["Medical", "Public"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://dgme.teletalk.com.bd"
      },
      {
        id: "kmc", name: "Khulna Medical College", unit: "MBBS", exam_date: "2026-02-09", app_start_date: "2026-01-11", app_deadline: "2026-01-23", exam_type: "MCQ", seats: 160, tags: ["Medical", "Public"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://dgme.teletalk.com.bd"
      },
      {
        id: "ruet", name: "Rajshahi University of Engineering & Technology (RUET)", unit: "Engineering", exam_date: "2026-05-15", app_start_date: "2026-03-20", app_deadline: "2026-04-25", exam_type: "Written", seats: 1235, tags: ["Engineering"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://www.ruet.ac.bd"
      },
      {
        id: "cuet", name: "Chittagong University of Engineering & Technology (CUET)", unit: "Engineering", exam_date: "2026-05-15", app_start_date: "2026-03-20", app_deadline: "2026-04-25", exam_type: "Written", seats: 960, tags: ["Engineering"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://www.cuet.ac.bd"
      },
      {
        id: "kuet", name: "Khulna University of Engineering & Technology (KUET)", unit: "Engineering", exam_date: "2026-05-15", app_start_date: "2026-03-20", app_deadline: "2026-04-25", exam_type: "Written", seats: 1065, tags: ["Engineering"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://www.kuet.ac.bd"
      },
      {
        id: "just", name: "Jashore University of Science and Technology (JUST)", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 1050, tags: ["Science & Tech"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "pstu", name: "Patuakhali Science and Technology University (PSTU)", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 730, tags: ["Science & Tech"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "bau", name: "Bangladesh Agricultural University (BAU)", unit: "Agriculture Cluster", exam_date: "2026-05-25", app_start_date: "2026-04-10", app_deadline: "2026-05-10", exam_type: "MCQ", seats: 1116, tags: ["Agriculture"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science"], apply_url: "https://acas.edu.bd"
      },
      {
        id: "sau", name: "Sher-e-Bangla Agricultural University (SAU)", unit: "Agriculture Cluster", exam_date: "2026-05-25", app_start_date: "2026-04-10", app_deadline: "2026-05-10", exam_type: "MCQ", seats: 700, tags: ["Agriculture"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science"], apply_url: "https://acas.edu.bd"
      },
      {
        id: "duet", name: "Dhaka University of Engineering and Technology (DUET)", unit: "Engineering", exam_date: "2026-05-15", app_start_date: "2026-03-20", app_deadline: "2026-04-25", exam_type: "Written", seats: 880, tags: ["Engineering"], req_ssc: 4.0, req_hsc: 4.0, req_total: 9.0, allowed_groups: ["Science"], apply_url: "https://www.duet.ac.bd"
      },
      {
        id: "mbstu", name: "Mawlana Bhashani Science and Technology University (MBSTU)", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 815, tags: ["Science & Tech"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "nstu", name: "Noakhali Science and Technology University (NSTU)", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 1200, tags: ["Science & Tech"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "hstu", name: "Hajee Mohammad Danesh Science and Technology University (HSTU)", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 2005, tags: ["Science & Tech"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "bsmrstu", name: "Bangabandhu Sheikh Mujibur Rahman Science and Technology University (BSMRSTU)", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 1500, tags: ["Science & Tech"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "pust", name: "Pabna University of Science and Technology (PUST)", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 920, tags: ["Science & Tech"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "rmstu", name: "Rangamati Science and Technology University (RMSTU)", unit: "GST Cluster", exam_date: "2026-04-15", app_start_date: "2026-02-20", app_deadline: "2026-03-20", exam_type: "MCQ", seats: 150, tags: ["Science & Tech"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science", "Commerce", "Arts"], apply_url: "https://gstadmission.ac.bd"
      },
      {
        id: "cvasu", name: "Chittagong Veterinary and Animal Sciences University (CVASU)", unit: "Agriculture Cluster", exam_date: "2026-05-25", app_start_date: "2026-04-10", app_deadline: "2026-05-10", exam_type: "MCQ", seats: 245, tags: ["Agriculture", "Veterinary"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science"], apply_url: "https://acas.edu.bd"
      },
      {
        id: "sylau", name: "Sylhet Agricultural University (SAU)", unit: "Agriculture Cluster", exam_date: "2026-05-25", app_start_date: "2026-04-10", app_deadline: "2026-05-10", exam_type: "MCQ", seats: 431, tags: ["Agriculture"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science"], apply_url: "https://acas.edu.bd"
      },
      {
        id: "kau", name: "Khulna Agricultural University (KAU)", unit: "Agriculture Cluster", exam_date: "2026-05-25", app_start_date: "2026-04-10", app_deadline: "2026-05-10", exam_type: "MCQ", seats: 350, tags: ["Agriculture"], req_ssc: 3.5, req_hsc: 3.5, req_total: 8.0, allowed_groups: ["Science"], apply_url: "https://acas.edu.bd"
      }
    ];

    return {
      items: mockData,
      pagination: { currentPage: 1, lastPage: 1, perPage: 15, total: mockData.length },
    };
  }
}
