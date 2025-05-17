"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { router, usePage } from "@inertiajs/react"
import { useState } from "react"
// Import model and page props interfaces from your types file
import type { ClassRoom, Department, Student, StudentListPageProps } from "@/types/index" // Import from types file
import { route } from "ziggy-js"

export default function StudentList() {
  // Access the data from Inertia page props using the specific PageProps interface
  const { students, classes, departments } = usePage<StudentListPageProps>().props

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeDepartmentId, setActiveDepartmentId] = useState<string | "all">("all")

  // Filter students based on the active department tab
  const filteredStudents =
    activeDepartmentId === "all"
      ? students
      : students.filter((student) => student.department.id.toString() === activeDepartmentId)

  // Handle assigning a class (Placeholder for API call)
  const handleAssignClass = () => {
    if (!selectedStudent || !selectedClass) return

    console.log(`Attempting to assign Class ID ${selectedClass} to Student ID ${selectedStudent.id}`)

    // --- API call to assign class to student ---
    router.patch(
      route("admin.classes.assign-students", { class: selectedClass }),
      {
        student_ids: [selectedStudent.id],
      },
      {
        onSuccess: () => {
          console.log("Class assigned successfully via API")
          // Inertia will handle the redirect or prop update, which will re-render the list
          // The flash message listener will show the success toast
          setIsDialogOpen(false)
          setSelectedStudent(null)
          setSelectedClass("")
        },
        onError: (errors: Record<string, string>) => {
          console.error("Failed to assign class via API", errors)
        },
      },
    )
    // --- End API call ---
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">Student Management</h1>

      {/* Department Filter Tabs */}
      <Tabs value={activeDepartmentId} onValueChange={setActiveDepartmentId} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-8">
          <TabsTrigger value="all">All Departments</TabsTrigger>
          {/* Use imported Department interface in map */}
          {departments?.map((dept: Department) => (
            <TabsTrigger key={dept.id} value={dept.id.toString()}>
              {dept.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeDepartmentId} className="mt-0"></TabsContent>
      </Tabs>

      <div className="rounded-lg bg-white shadow">
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
            {/* Use imported Student interface in map */}
            {filteredStudents?.map((student: Student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  {student.user.first_name} {student.user.last_name}
                </TableCell>
                <TableCell>{student.department.name}</TableCell>
                <TableCell>
                  <Badge variant={student.classes.length > 0 ? "default" : "secondary"}>
                    {student.classes.length > 0 ? "Assigned" : "Unassigned"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {student.classes.length > 0 ? student.classes.map((c) => c.name).join(", ") : "None"}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedStudent(student)
                      setIsDialogOpen(true)
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
        {filteredStudents?.length === 0 && (
          <div className="text-muted-foreground p-4 text-center">No students found for this department.</div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assign Class to {selectedStudent?.user.first_name} {selectedStudent?.user.last_name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Select onValueChange={setSelectedClass} value={selectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {/* Use imported ClassRoom interface in map */}
                {classes?.map((classItem: ClassRoom) => (
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
              <Button onClick={handleAssignClass} disabled={!selectedClass || !selectedStudent}>
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
