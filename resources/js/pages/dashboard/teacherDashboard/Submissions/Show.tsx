import { AppLayout } from "@/layouts/dashboard/teacherDashboard/teacherDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "@inertiajs/react";
import { Submission } from "@/types/index";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface SubmissionShowProps {
  submission: Submission;
}

export default function SubmissionShow({ submission }: SubmissionShowProps) {
  const { toast } = useToast();
  const { data, setData, post, processing, errors } = useForm({
    grade: submission.grade || '',
    feedback: submission.feedback || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('teacher.submissions.update', submission.id), {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Submission graded successfully!",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to grade submission.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <AppLayout title={`Review Submission - ${submission.test.title}`}>
      <div className="space-y-6">
        {/* ML Grading Results */}
        <Card>
          <CardHeader>
            <CardTitle>ML Grading Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ML Verdict</Label>
                <Badge variant={submission.ml_verdict_id === 0 ? "success" : "destructive"}>
                  {submission.ml_verdict_string}
                </Badge>
              </div>
              <div>
                <Label>Confidence</Label>
                <p>
                  {submission.ml_verdict_probabilities?.Accepted 
                    ? `${(submission.ml_verdict_probabilities.Accepted * 100).toFixed(1)}%`
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div>
              <Label>Verdict Probabilities</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(submission.ml_verdict_probabilities || {}).map(([verdict, probability]) => (
                  <div key={verdict} className="flex justify-between">
                    <span>{verdict}</span>
                    <span>{(probability * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student's Submission */}
        <Card>
          <CardHeader>
            <CardTitle>Student's Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              {submission.code_editor_text}
            </pre>
          </CardContent>
        </Card>

        {/* Teacher's Grading Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Grading</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="grade">Grade (%)</Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  value={data.grade}
                  onChange={(e) => setData('grade', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  value={data.feedback}
                  onChange={(e) => setData('feedback', e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : 'Save Grade'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 