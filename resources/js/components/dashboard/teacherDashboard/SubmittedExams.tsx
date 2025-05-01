import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";

interface Student {
  id: number;
  name: string;
  submitted: boolean;
  answer?: string;
  submitted_at?: string;
}

interface Exam {
  id: number;
  title: string;
  students: Student[];
}

export const SubmittedExams = () => {
  // Mock data - replace with API calls in a real implementation
  const mockExams: Exam[] = [
    {
      id: 1,
      title: 'Midterm Exam',
      students: [
        { 
          id: 101, 
          name: 'John Doe', 
          submitted: true,
          answer: 'The student provided a comprehensive answer to all questions...',
          submitted_at: '2023-05-15T14:30:00Z'
        },
        { 
          id: 102, 
          name: 'Jane Smith', 
          submitted: true,
          answer: 'Excellent responses showing deep understanding of concepts...',
          submitted_at: '2023-05-14T10:15:00Z'
        },
      ]
    },
    {
      id: 2,
      title: 'Final Exam',
      students: [
        { 
          id: 101, 
          name: 'John Doe', 
          submitted: true,
          answer: 'Good effort but some answers needed more detail...',
          submitted_at: '2023-06-20T16:45:00Z'
        },
        { 
          id: 103, 
          name: 'Bob Johnson', 
          submitted: false 
        },
      ]
    }
  ];

  const [exams] = useState<Exam[]>(mockExams);
  const [expandedExam, setExpandedExam] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Submitted Exams</CardTitle>
        <CardDescription className="text-muted-foreground">
          View student submissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedStudent ? (
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedStudent(null)}
              className="text-primary hover:text-primary/90"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to list
            </Button>
            
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  {selectedStudent.name}'s Submission
                </CardTitle>
                {selectedStudent.submitted_at && (
                  <CardDescription className="text-muted-foreground">
                    Submitted on: {new Date(selectedStudent.submitted_at).toLocaleString()}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-4 bg-muted rounded-lg">
                <p className="text-foreground">
                  {selectedStudent.answer || "No answer submitted."}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => (
              <Card key={exam.id} className="border-border overflow-hidden">
                <Button
                  variant="ghost"
                  className="w-full h-auto p-4 flex justify-between items-center hover:bg-accent"
                  onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}
                >
                  <span className="text-foreground font-medium">{exam.title}</span>
                  <span className="text-muted-foreground">
                    {expandedExam === exam.id ? '−' : '+'}
                  </span>
                </Button>
                
                {expandedExam === exam.id && (
                  <CardContent className="p-4 pt-0">
                    <ul className="space-y-2">
                      {exam.students.filter(s => s.submitted).map((student) => (
                        <li key={student.id}>
                          <Button
                            variant="ghost"
                            className="w-full h-auto p-2 justify-between items-center hover:bg-accent"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <span className="text-foreground">{student.name}</span>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Submitted
                            </Badge>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};