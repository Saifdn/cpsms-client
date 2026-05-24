import { Page, PageHeader } from "@/components/layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { adminColumns } from "@/components/columns/AdminColumns";
import { useAdmins } from "@/hooks/user/useAdmin";
import { useCreateAdmin } from "@/hooks/user/useAdmin";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

import { CreateDialog } from "@/components/dialog/CreateDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Admin = () => {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    isLoading,
    error,
    refetch
  } = useAdmins({
    page: currentPage,
    limit,
    search: debouncedSearch,
  });

  const createAdmin = useCreateAdmin();

  // Safely extract data
  const admins = data?.data || [];
  const pagination = data?.pagination;

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    adminLevel: "admin",
  });

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleCreate = () => {
    createAdmin.mutate(formData, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ 
          fullName: "", 
          email: "", 
          phone: "", 
          adminLevel: "admin" 
        });
        setCurrentPage(1);     // Reset to first page after creating
        refetch();
      },
    });
  };

  if (error) {
    return (
      <Page>
        <PageHeader 
          title="Admin Management" 
          description="Error loading data" 
        />
        <div className="p-8 text-center text-red-500">
          Failed to load admins. Please try again.
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title="Admin Management"
        description="Manage your administrators and their permissions."
      />

      <div className="grid gap-6 py-8">
        {/* Add New Admin Button */}
        <div className="flex justify-end">
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Admin
          </Button>
        </div>

        <DataTable
          title="List of Admins"
          description="View and manage all administrators in your organization."
          columns={adminColumns}
          data={admins}
          isLoading={isLoading}
          onRefresh={refetch}
          searchValue={search}
          onSearchChange={setSearch}
          currentPage={currentPage}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={setCurrentPage}
          limit={limit}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* Create Dialog */}
      <CreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Admin"
        description="Add a new administrator to the system."
        onSave={handleCreate}
        isLoading={createAdmin.isPending}
        saveLabel="Create Admin"
      >
        <div className="space-y-6">
          <Field>
            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              disabled={createAdmin.isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={createAdmin.isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <PhoneInput
              international
              defaultCountry="MY"
              countryCallingCodeEditable={false}
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value || "" })}
              disabled={createAdmin.isPending}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors",
                "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
                "[&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:ring-0 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:placeholder:text-muted-foreground",
                "[&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:border-0 [&_.PhoneInputCountrySelect]:outline-none",
                createAdmin.isPending && "cursor-not-allowed opacity-50"
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="adminLevel">Admin Level</FieldLabel>
            <Select
              value={formData.adminLevel}
              onValueChange={(value) => setFormData({ ...formData, adminLevel: value })}
              disabled={createAdmin.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select admin level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </CreateDialog>
    </Page>
  );
};

export default Admin;