export const MEDICAL_SPECIALTIES = [
  "General Physician",
  "Medicine",
  "Cardiology",
  "Dermatology (Skin)",
  "Gastroenterology",
  "Neurology",
  "Orthopedics",
  "Gynecology",
  "Pediatrics (Child)",
  "Ophthalmology (Eye)",
  "ENT (Ear, Nose, Throat)",
  "Dental / Dentistry",
  "Psychiatry",
  "Surgery",
  "Urology",
  "Nutritionist",
] as const;

export type MedicalSpecialty = (typeof MEDICAL_SPECIALTIES)[number];
