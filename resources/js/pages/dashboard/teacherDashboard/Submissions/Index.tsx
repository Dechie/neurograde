import { AppLayout } from "@/layouts/dashboard/teacherDashboard/teacherDashoboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import type { Submission } from "@/types/index";

interface SubmissionsPageProps {
  test: TestSubmission;
  submissions: Submission[];
}
interface TestSubmission {
    id: number;
    title: string;
    submissions: Submission[];
}

export default function SubmissionsIndex({ test, submissions }: SubmissionsPageProps) {
  return (
    <AppLayout title={`Submissions - ${test.title}`}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Submissions for {test.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>ML Verdict</TableHead>
                  <TableHead>ML Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Final Grade</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      {submission.student.user.name}
                    </TableCell>
                    <TableCell>{new Date(submission.submission_date).toLocaleString()}</TableCell>
                    <TableCell>
                      {submission.ml_verdict_string || 'Not graded'}
                    </TableCell>
                    <TableCell>
                      {submission.ml_verdict_probabilities ? 
                        `${Math.round(Math.max(...Object.values(submission.ml_verdict_probabilities)) * 100)}%` : 
                        'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={submission.status === 'graded' ? "default" : "secondary"}>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{submission.grade || 'Not graded'}</TableCell>
                    <TableCell>
                      <Link href={route('teacher.submissions.show', submission.id)}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 