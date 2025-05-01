import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Student {
  id: number;
  name: string;
  submitted: boolean;
  autoGrade: number;
  answer?: string;
}

interface Exam {
  id: number;
  title: string;
  students: Student[];
}

export const GradingPage = () => {
  const mockExams: Exam[] = [
    {
      id: 1,
      title: 'Midterm Exam',
      students: [
        { 
          id: 101, 
          name: 'John Doe', 
          submitted: true, 
          autoGrade: 85,
          answer: 'The student provided a detailed response to the exam questions...'
        },
        { 
          id: 102, 
          name: 'Jane Smith', 
          submitted: true, 
          autoGrade: 92,
          answer: 'Excellent responses showing deep understanding of the material...'
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
          autoGrade: 78,
          answer: 'Good effort but some answers lacked depth...'
        },
        { 
          id: 103, 
          name: 'Bob Johnson', 
          submitted: false ,
          autoGrade: 78,
          answer: 'Good effort but some answers lacked depth...'
        },
      ]
    }
  ];

  const [exams] = useState<Exam[]>(mockExams);
  const [expandedExam, setExpandedExam] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting grade:', { 
      studentId: selectedStudent?.id, 
      grade, 
      feedback 
    });
    setSelectedStudent(null);
  };

  if (exams.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No exams available for grading.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Grading</CardTitle>
        <CardDescription className="text-muted-foreground">
          Review and grade student submissions
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
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-foreground">
                    {selectedStudent.answer || "No answer submitted."}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-foreground font-medium mb-2">Automatic Grading</h4>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Score: {selectedStudent.autoGrade}/100
                  </Badge>
                </div>
                
                <form onSubmit={handleGradeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-foreground">
                      Final Grade
                    </Label>
                    <Input
                      id="grade"
                      type="number"
                      min="0"
                      max="100"
                      className="w-24 border-border focus:ring-ring"
                      value={grade}
                      onChange={(e) => setGrade(Number(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="feedback" className="text-foreground">
                      Feedback
                    </Label>
                    <Textarea
                      id="feedback"
                      className="border-border focus:ring-ring min-h-[120px]"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide constructive feedback..."
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Submit Grade
                  </Button>
                </form>
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
                            onClick={() => {
                              setSelectedStudent(student);
                              setGrade(student.autoGrade);
                              setFeedback('');
                            }}
                          >
                            <span className="text-foreground">{student.name}</span>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              Auto-graded: {student.autoGrade}/100
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