import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { Label } from "@/components/admin/ui/label";
import { Button } from "@/components/admin/ui/button";
import { Plus, List } from "lucide-react";
import Link from "next/link";

export default function AddMemberPage() {
  return (
    <div className="w-full space-y-6 px-3 py-4 md:px-4 lg:px-5">
      <PageHeader
        title="Add New Member"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Members", href: "/admin/members/list" },
          { label: "Add" },
        ]}
        action={
          <Link href="/admin/members/list">
            <Button variant="secondary">
              <List size={18} className="mr-2" />
              View Members
            </Button>
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input type="text" placeholder="e.g. Nusrat Jahan" />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input type="number" placeholder="" />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea placeholder="Enter full address" />
          </div>

          <div className="pt-4 flex justify-end">
            <Button>
              <Plus size={18} className="mr-2" />
              Save Member
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
