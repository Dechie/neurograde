import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const CreateExamForm = () => {
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    dueDate: '',
    questions: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
  };

  return (
    <Card className="border-border">
    
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Exam Title
            </Label>
            <Input
              id="title"
              type="text"
              className="border-border focus:ring-ring"
              value={examData.title}
              onChange={(e) => setExamData({...examData, title: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description/Question
            </Label>
            <Textarea
              id="description"
              className="border-border focus:ring-ring min-h-[120px]"
              value={examData.description}
              onChange={(e: { target: { value: any; }; }) => setExamData({...examData, description: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-foreground">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="datetime-local"
              className="border-border focus:ring-ring"
              value={examData.dueDate}
              onChange={(e) => setExamData({...examData, dueDate: e.target.value})}
              required
            />
          </div>
          
          {/* Additional question fields could be added here */}
          
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Create Exam
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};