import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Teacher {
  id: number;
  user: {
    name: string;
  };
  department: {
    name: string;
  };
  classes: Array<{
    id: number;
    name: string;
  }>;
}

interface Class {
  id: number;
  name: string;
}

export default function TeacherList() {
  const defaultTeachers: Teacher[] = [
    {
      id: 1,
      user: { name: "Ewnet" },
      department: { name: "Mechanical" },
      classes: [] 
    },
    {
      id: 2,
      user: { name: "Sarah" },
      department: { name: "Software" },
      classes: [
        { id: 1, name: "Section B" }
      ]
    }
  ];

  const defaultClasses: Class[] = [
    { id: 1, name: "Section A" },
    { id: 2, name: "Section B" },
    { id: 3, name: "Section C" }
  ];

  const { teachers = defaultTeachers, classes = defaultClasses } = {} as any; 
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localTeachers, setLocalTeachers] = useState<Teacher[]>(teachers);

  const handleAssignClass = () => {
    if (!selectedTeacher || !selectedClass) return;
    
    const updatedTeachers = localTeachers.map(teacher => {
      if (teacher.id === selectedTeacher.id) {
        const assignedClass = classes.find((c: { id: any; }) => String(c.id) === selectedClass);
        if (assignedClass && !teacher.classes.some(c => c.id === assignedClass.id)) {
          return {
            ...teacher,
            classes: [...teacher.classes, assignedClass]
          };
        }
      }
      return teacher;
    });
    
    setLocalTeachers(updatedTeachers);
  
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
            {localTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">{teacher.user.name}</TableCell>
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
              Assign Class to {selectedTeacher?.user.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Select onValueChange={setSelectedClass} value={selectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((classItem: any) => (
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