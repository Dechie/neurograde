// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface Student {
//   id: number;
//   user: {
//     name: string;
//   };
//   department: {
//     name: string;
//   };
//   classes: Array<{
//     id: number;
//     name: string;
//   }>;
// }

// interface Class {
//   id: number;
//   name: string;
// }

// export default function StudentList() {
//   const defaultStudent: Student[] = [
//     {
//       id: 1,
//       user: { name: "Tmar" },
//       department: { name: "Mechanical" },
//       classes: [] 
//     },
//     {
//       id: 2,
//       user: { name: "Tio" },
//       department: { name: "Software" },
//       classes: [
//         { id: 1, name: "Section B" }
//       ]
//     }
//   ];

//   const defaultClasses: Class[] = [
//     { id: 1, name: "Section A" },
//     { id: 2, name: "Section B" },
//     { id: 3, name: "Section C" }
//   ];

//   const { student = defaultStudent, classes = defaultClasses } = {} as any; 
//   const [selectedStudent, setSelectedTeacher] = useState<Student | null>(null);
//   const [selectedClass, setSelectedClass] = useState<string>("");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [localStudent, setLocalTeachers] = useState<Student[]>(student);

//   const handleAssignClass = () => {
//     if (!selectedStudent || !selectedClass) return;
    
//     const updatedTeachers = localStudent.map(student => {
//       if (student.id === selectedStudent.id) {
//         const assignedClass = classes.find((c: { id: any; }) => String(c.id) === selectedClass);
//         if (assignedClass && !student.classes.some(c => c.id === assignedClass.id)) {
//           return {
//             ...student,
//             classes: [...student.classes, assignedClass]
//           };
//         }
//       }
//       return student;
//     });
    
//     setLocalTeachers(updatedTeachers);
  
//     setIsDialogOpen(false);
//     setSelectedTeacher(null);
//     setSelectedClass("");
//   };

//   return (
//     <div className="container mx-auto py-6">
//       <h1 className="text-2xl font-bold mb-6">Student Management</h1>
      
//       <div className="bg-white rounded-lg shadow">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Department</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Assigned Classes</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {localStudent.map((student) => (
//               <TableRow key={student.id}>
//                 <TableCell className="font-medium">{student.user.name}</TableCell>
//                 <TableCell>{student.department.name}</TableCell>
//                 <TableCell>
//                   <Badge variant={student.classes.length > 0 ? "default" : "secondary"}>
//                     {student.classes.length > 0 ? "Assigned" : "Unassigned"}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   {student.classes.length > 0 
//                     ? student.classes.map(c => c.name).join(", ")
//                     : "None"}
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => {
//                       setSelectedTeacher(student);
//                       setIsDialogOpen(true);
//                     }}
//                   >
//                     Assign Class
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               Assign Class to {selectedStudent?.user.name}
//             </DialogTitle>
//           </DialogHeader>
          
//           <div className="space-y-4">
//             <Select onValueChange={setSelectedClass} value={selectedClass}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a class" />
//               </SelectTrigger>
//               <SelectContent>
//                 {classes.map((classItem: any) => (
//                   <SelectItem key={classItem.id} value={String(classItem.id)}>
//                     {classItem.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
            
//             <div className="flex justify-end space-x-2">
//               <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAssignClass} disabled={!selectedClass}>
//                 Assign
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react"; // Import useEffect
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePage } from "@inertiajs/react"; // Import usePage
import { PageProps } from "@/types"; // Assuming PageProps type
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Import Tabs components

// Define interfaces for the data structure expected from the backend
interface User {
  id: number;
  first_name: string; // Assuming first_name and last_name based on your User model
  last_name: string;
  // Add other user properties if needed
}

interface Department {
  id: number;
  name: string;
}

interface ClassRoom { // Renamed from Class to ClassRoom to avoid conflict if Class is a reserved word
  id: number;
  name: string;
  // Add other class properties if needed
}

interface Student {
  id: number;
  user: User; // Student has a user relationship
  department: Department; // Student has a department relationship
  classes: ClassRoom[]; // Student has a many-to-many relationship with ClassRoom
  // Add other student properties if needed
}

// Define the props expected by this page component
interface Props extends PageProps {
  students: Student[]; // Expecting an array of Student objects from the backend
  classes: ClassRoom[]; // Expecting an array of ClassRoom objects from the backend
  departments: Department[]; // Expecting an array of Department objects from the backend
  // You might also pass unassignedStudents separately if needed, but filtering can be done here
  // unassignedStudents?: Student[];
}


export default function StudentList() {
  // Access the data from Inertia page props
  const { students, classes, departments } = usePage<Props>().props;

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // State to manage the active department tab filter
  const [activeDepartmentId, setActiveDepartmentId] = useState<string | 'all'>('all');

  // Filter students based on the active department tab
  const filteredStudents = activeDepartmentId === 'all'
    ? students
    : students.filter(student => student.department.id.toString() === activeDepartmentId);


  // Handle assigning a class (This logic is currently client-side only)
  // To make this persistent, you would need to send an API request here.
  const handleAssignClass = () => {
    if (!selectedStudent || !selectedClass) return;

    // --- Placeholder for API call to assign class to student ---
    console.log(`Assigning Class ID ${selectedClass} to Student ID ${selectedStudent.id}`);
    // You would use Inertia.post or Inertia.patch here to send the data
    // to your backend endpoint for assigning students to classes.
    // Example:
    // Inertia.post(route('admin.classes.assign-students', { class: selectedClass }), {
    //     student_ids: [selectedStudent.id], // Send the student ID in an array
    // }, {
    //     onSuccess: () => {
    //         console.log('Class assigned successfully via API');
    //         // Inertia will handle the redirect or prop update, which will re-render the list
    //     },
    //     onError: (errors) => {
    //         console.error('Failed to assign class via API', errors);
    //         // Handle API errors (e.g., show a toast)
    //     }
    // });
    // --- End Placeholder ---


    // --- Client-side update logic (Optional: for immediate visual feedback before API response) ---
    // If you are not redirecting after API call, you might update local state here.
    // const assignedClassObj = classes.find(c => String(c.id) === selectedClass);
    // if (assignedClassObj) {
    //     const updatedStudents = students.map(student => {
    //         if (student.id === selectedStudent.id) {
    //             if (!student.classes.some(c => c.id === assignedClassObj.id)) {
    //                 return {
    //                     ...student,
    //                     classes: [...student.classes, assignedClassObj]
    //                 };
    //             }
    //         }
    //         return student;
    //     });
    //     // Note: If using local state, you would need to manage it carefully
    //     // setLocalStudents(updatedStudents); // Assuming you had local state
    // }
    // --- End Client-side Update Logic ---


    setIsDialogOpen(false);
    setSelectedStudent(null); // Reset selected student
    setSelectedClass(""); // Reset selected class dropdown
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>

      {/* Department Filter Tabs */}
      <Tabs value={activeDepartmentId} onValueChange={setActiveDepartmentId} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-8"> {/* Adjust grid columns as needed */}
          <TabsTrigger value="all">All Departments</TabsTrigger>
          {departments.map(dept => (
            <TabsTrigger key={dept.id} value={dept.id.toString()}>{dept.name}</TabsTrigger>
          ))}
        </TabsList>
        {/* TabsContent is not strictly necessary for filtering, but good practice if content changes */}
        <TabsContent value={activeDepartmentId} className="mt-0"> {/* Remove default margin top */}
            {/* The table content goes here, filtered by activeDepartmentId */}
        </TabsContent>
      </Tabs>


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
            {/* Map over the filteredStudents */}
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                {/* Access user's first and last name */}
                <TableCell className="font-medium">{student.user.first_name} {student.user.last_name}</TableCell>
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
                      setSelectedStudent(student);
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
         {/* Optional: Message if no students found after filtering */}
         {filteredStudents.length === 0 && (
             <div className="p-4 text-center text-muted-foreground">
                 No students found for this department.
             </div>
         )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assign Class to {selectedStudent?.user.first_name} {selectedStudent?.user.last_name} {/* Use first/last name */}
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
