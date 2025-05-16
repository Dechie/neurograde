import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

interface User {
  id: number;
  first_name: string; 
  last_name: string;
}

interface Department {
  id: number;
  name: string;
}

interface ClassRoom {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  user: User;
  department: Department;
  classes: ClassRoom[];
}

interface Props extends PageProps {
  teachers: Teacher[];
  classes: ClassRoom[];
}


export default function TeacherList() {
  const { teachers, classes } = usePage<Props>().props;

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use the teachers prop directly or initialize local state if you plan to modify it
  // For simply displaying, using the prop directly is often sufficient.
  // If you need to update the list after assigning a class without a full page reload,
  // you might manage local state and update it after a successful API call.
  // For now, let's use the prop directly for simplicity.
  // const [localTeachers, setLocalTeachers] = useState<Teacher[]>(teachers);

  // If you were using local state and needed to update it when the prop changes (e.g., after a redirect with updated data)
  // useEffect(() => {
  //   setLocalTeachers(teachers);
  // }, [teachers]);


  // Handle assigning a class (This logic is currently client-side only)
  // To make this persistent, you would need to send an API request here.
  const handleAssignClass = () => {
    if (!selectedTeacher || !selectedClass) return;

    const assignedClass = classes.find(c => String(c.id) === selectedClass);

    if (assignedClass) {
         // If you were using local state:
        // const updatedTeachers = localTeachers.map(teacher => {
        //   if (teacher.id === selectedTeacher.id) {
        //     // Check if class is already assigned to prevent duplicates in UI
        //     if (!teacher.classes.some(c => c.id === assignedClass.id)) {
        //       return {
        //         ...teacher,
        //         classes: [...teacher.classes, assignedClass]
        //       };
        //     }
        //   }
        //   return teacher;
        // });
        // setLocalTeachers(updatedTeachers);

        console.log(`Assigning Class ID ${selectedClass} to Teacher ID ${selectedTeacher.id}`);
        // --- Placeholder for API call ---
        // Example using Inertia.patch (assuming you have a route for assigning classes to teachers)
        // Inertia.patch(route('admin.teachers.assign-class', selectedTeacher.id), {
        //     class_id: assignedClass.id,
        // }, {
        //     onSuccess: () => {
        //         // Inertia will handle the redirect or prop update
        //         console.log('Class assigned successfully via API');
        //     },
        //     onError: (errors) => {
        //         console.error('Failed to assign class via API', errors);
        //         // Handle API errors (e.g., show a toast)
        //     }
        // });
        // --- End Placeholder ---
    }


    setIsDialogOpen(false);
    setSelectedTeacher(null);
    setSelectedClass("");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Management</h1>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Classes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Map over the teachers prop received from the backend */}
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                {/* Access user's first and last name */}
                <TableCell className="font-medium">{teacher.user.first_name} {teacher.user.last_name}</TableCell>
                <TableCell>{teacher.department.name}</TableCell>
                <TableCell>
                  <Badge variant={teacher.classes.length > 0 ? "default" : "secondary"}>
                    {teacher.classes.length > 0 ? "Assigned" : "Unassigned"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {teacher.classes.length > 0
                    ? teacher.classes.map(c => c.name).join(", ")
                    : "None"}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setIsDialogOpen(true);
                    }}
                  >
                    Assign Class
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assign Class to {selectedTeacher?.user.first_name} {selectedTeacher?.user.last_name} {/* Use first/last name */}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Select onValueChange={setSelectedClass} value={selectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {/* Map over the classes prop received from the backend */}
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={String(classItem.id)}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignClass} disabled={!selectedClass}>
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
