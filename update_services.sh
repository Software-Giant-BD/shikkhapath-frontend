#!/bin/bash

update_page() {
    file=$1
    placement=$2
    
    # Read the file
    content=$(cat "$file")
    
    # If already has AdBanner, skip
    if echo "$content" | grep -q "AdBanner"; then
        echo "Skipping $file"
        return
    fi
    
    # Add import
    sed -i 's/import { Metadata } from "next";/import { Metadata } from "next";\nimport { AdBanner } from "@/components/customer/home\/ad-banner";/' "$file"
    
    # Add AdBanner before the client component inside the return
    # Find the return line
    client_comp=$(grep -o '<[A-Z][a-zA-Z]*Client[^>]*/>' "$file")
    if [ -z "$client_comp" ]; then
        client_comp=$(grep -o '<[A-Z][a-zA-Z]*[^>]*/>' "$file" | grep -v 'Metadata')
    fi
    
    # Replace the return line with <> AdBanner ClientComponent </>
    sed -i "s|return .*$client_comp.*|return (\n    <>\n      <div className=\"container mx-auto px-4 pt-8\">\n        <AdBanner label=\"[ বিজ্ঞাপন — ৯৭০×৯০ ]\" className=\"h-[90px]\" category=\"services pages\" placement=\"$placement\" />\n      </div>\n      $client_comp\n    </>\n  );|" "$file"
    echo "Updated $file"
}

update_page "app/(customer)/police/page.tsx" "Police Ad"
update_page "app/(customer)/fire-service/page.tsx" "Fire Ad"
update_page "app/(customer)/blood-donation/page.tsx" "Blood Ad"
update_page "app/(customer)/doctors/page.tsx" "Doctor Ad"
update_page "app/(customer)/jobs/page.tsx" "Jobs Ad"
update_page "app/(customer)/ssc-hsc/page.tsx" "SSC/HSC (রুটিন | রেজাল্ট) Ad"
update_page "app/(customer)/admission/page.tsx" "Admission Ad"
update_page "app/(customer)/cgpa-calculator/page.tsx" "CGPA Calculator Ad"
