import { useState, useMemo, useCallback } from "react";
import { Page, PageHeader } from "@/components/layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { CreateDialog } from "@/components/dialog/CreateDialog";
import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { MoreHorizontal, ChevronsUpDown, Plus, X } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  useTasks,
  useAllStaff,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/task/useTasks";
import {
  CategoryBadge,
  CATEGORY_CONFIG,
  CATEGORIES,
} from "@/components/task/TaskCategoryBadge";

function TaskActionsCell({ task, onEdit, onDelete }) {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete({ id: task._id, title: task.title })}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function createTaskColumns({ onEdit, onDelete }) {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium max-w-[200px] truncate">
          {row.original.title}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <CategoryBadge value={row.original.category} />,
    },
    {
      id: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        const names =
          row.original.assignedTo?.map((u) => u.fullName).join(", ") || "—";
        return (
          <span className="text-sm text-muted-foreground truncate max-w-[180px] block">
            {names}
          </span>
        );
      },
    },
    {
      id: "assignedBy",
      header: "Created By",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.assignedBy?.fullName ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), "d MMM yyyy"),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <TaskActionsCell
          task={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
}

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "other",
  assignedTo: [],
};

function TaskFormFields({ form, onChange, staffList = [], staffLoading }) {
  const [openAssign, setOpenAssign] = useState(false);

  const toggleStaff = (id) => {
    onChange(
      "assignedTo",
      form.assignedTo.includes(id)
        ? form.assignedTo.filter((x) => x !== id)
        : [...form.assignedTo, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="task-title">Title *</Label>
        <Input
          id="task-title"
          placeholder="Enter task title"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          placeholder="Optional description"
          rows={3}
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="task-category">Category</Label>
        <Select
          value={form.category}
          onValueChange={(v) => onChange("category", v)}
        >
          <SelectTrigger id="task-category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_CONFIG[cat].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Assign To *</Label>
        <Popover open={openAssign} onOpenChange={setOpenAssign}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between font-normal"
            >
              <span className="truncate">
                {form.assignedTo.length > 0
                  ? `${form.assignedTo.length} staff selected`
                  : "Select staff members..."}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[440px] p-0">
            <Command>
              <CommandInput placeholder="Search staff..." />
              <CommandEmpty>
                {staffLoading ? "Loading..." : "No staff found."}
              </CommandEmpty>
              <CommandGroup className="max-h-52 overflow-auto">
                {staffList.map((s) => (
                  <CommandItem
                    key={s._id}
                    value={`${s.fullName} ${s.email}`}
                    onSelect={() => toggleStaff(s._id)}
                  >
                    <Checkbox
                      checked={form.assignedTo.includes(s._id)}
                      className="mr-2 pointer-events-none"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate">{s.fullName}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {s.email}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {form.assignedTo.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {form.assignedTo.map((id) => {
              const s = staffList.find((x) => x._id === id);
              return s ? (
                <Badge key={id} variant="secondary" className="text-xs gap-1">
                  {s.fullName}
                  <button
                    type="button"
                    className="hover:text-destructive ml-0.5"
                    onClick={() => toggleStaff(id)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const EMPTY_EDIT = null;

const AdminTasks = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(EMPTY_EDIT);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: tasksData, isLoading } = useTasks();
  const { data: staffData, isLoading: staffLoading } = useAllStaff();
  const { mutate: createTask, isPending: createPending } = useCreateTask();
  const { mutate: updateTask, isPending: updatePending } = useUpdateTask();
  const { mutate: deleteTask, isPending: deletePending } = useDeleteTask();

  const tasks = tasksData?.data ?? [];
  const staffList = staffData?.data ?? [];

  const handleFormChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (form.assignedTo.length === 0) {
      toast.error("Please assign at least one staff member");
      return false;
    }
    return true;
  };

  const handleOpenCreate = () => {
    setForm(EMPTY_FORM);
    setShowCreate(true);
  };

  const handleCloseCreate = (open) => {
    if (!open) setForm(EMPTY_FORM);
    setShowCreate(open);
  };

  const handleCreate = () => {
    if (!validateForm()) return;
    createTask(
      {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        assignedTo: form.assignedTo,
      },
      { onSuccess: () => handleCloseCreate(false) }
    );
  };

  const handleOpenEdit = useCallback((task) => {
    setForm({
      title: task.title,
      description: task.description || "",
      category: task.category || "other",
      assignedTo: task.assignedTo?.map((u) => u._id) ?? [],
    });
    setEditTask(task);
  }, []);

  const handleCloseEdit = (open) => {
    if (!open) {
      setForm(EMPTY_FORM);
      setEditTask(null);
    }
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    updateTask(
      {
        id: editTask._id,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        assignedTo: form.assignedTo,
      },
      { onSuccess: () => handleCloseEdit(false) }
    );
  };

  const handleDelete = () => {
    deleteTask(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  const columns = useMemo(
    () => createTaskColumns({ onEdit: handleOpenEdit, onDelete: setDeleteTarget }),
    [handleOpenEdit]
  );

  return (
    <Page>
      <PageHeader
        title="Tasks"
        description="Manage and assign tasks to staff members"
        actions={
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        }
      />

      <DataTable
        title="All Tasks"
        description={`${tasks.length} task${tasks.length !== 1 ? "s" : ""} total`}
        columns={columns}
        data={tasks}
        isLoading={isLoading}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        onLimitChange={() => {}}
      />

      <CreateDialog
        open={showCreate}
        onOpenChange={handleCloseCreate}
        title="Create Task"
        description="Fill in the details and assign staff members."
        onSave={handleCreate}
        isLoading={createPending}
        saveLabel="Create"
      >
        <TaskFormFields
          form={form}
          onChange={handleFormChange}
          staffList={staffList}
          staffLoading={staffLoading}
        />
      </CreateDialog>

      <CreateDialog
        open={!!editTask}
        onOpenChange={handleCloseEdit}
        title="Edit Task"
        description="Update the task details or reassign staff members."
        onSave={handleUpdate}
        isLoading={updatePending}
        saveLabel="Save Changes"
      >
        <TaskFormFields
          form={form}
          onChange={handleFormChange}
          staffList={staffList}
          staffLoading={staffLoading}
        />
      </CreateDialog>

      <DeleteAlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        description="This will permanently delete the task"
        itemName={deleteTarget?.title}
        isLoading={deletePending}
      />
    </Page>
  );
};

export default AdminTasks;
