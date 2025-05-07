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

interface Student {
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

export default function StudentList() {
  const defaultStudent: Student[] = [
    {
      id: 1,
      user: { name: "Tmar" },
      department: { name: "Mechanical" },
      classes: [] 
    },
    {
      id: 2,
      user: { name: "Tio" },
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

  const { student = defaultStudent, classes = defaultClasses } = {} as any; 
  const [selectedStudent, setSelectedTeacher] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localStudent, setLocalTeachers] = useState<Student[]>(student);

  const handleAssignClass = () => {
    if (!selectedStudent || !selectedClass) return;
    
    const updatedTeachers = localStudent.map(student => {
      if (student.id === selectedStudent.id) {
        const assignedClass = classes.find((c: { id: any; }) => String(c.id) === selectedClass);
        if (assignedClass && !student.classes.some(c => c.id === assignedClass.id)) {
          return {
            ...student,
            classes: [...student.classes, assignedClass]
          };
        }
      }
      return student;
    });
    
    setLocalTeachers(updatedTeachers);
  
    setIsDialogOpen(false);
    setSelectedTeacher(null);
    setSelectedClass("");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>
      
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
            {localStudent.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.user.name}</TableCell>
                <TableCell>{student.department.name}</TableCell>
                <TableCell>
                  <Badge variant={student.classes.length > 0 ? "default" : "secondary"}>
                    {student.classes.length > 0 ? "Assigned" : "Unassigned"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {student.classes.length > 0 
                    ? student.classes.map(c => c.name).join(", ")
                    : "None"}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTeacher(student);
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
              Assign Class to {selectedStudent?.user.name}
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