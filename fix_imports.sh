#!/bin/bash
for file in app/\(customer\)/police/page.tsx app/\(customer\)/fire-service/page.tsx app/\(customer\)/blood-donation/page.tsx app/\(customer\)/doctors/page.tsx app/\(customer\)/jobs/page.tsx app/\(customer\)/ssc-hsc/page.tsx app/\(customer\)/admission/page.tsx app/\(customer\)/cgpa-calculator/page.tsx; do
  if ! grep -q "import { AdBanner }" "$file"; then
    sed -i '1iimport { AdBanner } from "@/components/customer/home/ad-banner";' "$file"
  fi
done
