import { CodeEditor } from '@/components/dashboard/studentDashboard/CodeEditor';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppLayout } from '@/layouts/dashboard/studentDashboard/studentDashboardLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import ReactMarkdown from 'react-markdown';
import { PrismAsync } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Type-safe code block renderer
const CodeBlock = ({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}) => {
  const match = /language-(\w+)/.exec(className || '');
  
  return !inline && match ? (
    <PrismAsync
      language={match[1]}
      style={atomDark as any}
      PreTag="div"
      customStyle={{
        margin: 0,
        borderRadius: '0.375rem',
        backgroundColor: 'rgb(40, 42, 54)'
      }}
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </PrismAsync>
  ) : (
    <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  );
};

// Custom components for Markdown elements
const MarkdownComponents = {
  h1: ({ node, ...props }: { node?: any; [key: string]: any }) => (
    <h1 className="text-3xl font-bold my-4" {...props} />
  ),
  h2: ({ node, ...props }: { node?: any; [key: string]: any }) => (
    <h2 className="text-2xl font-bold my-3" {...props} />
  ),
  h3: ({ node, ...props }: { node?: any; [key: string]: any }) => (
    <h3 className="text-xl font-semibold my-2" {...props} />
  ),
  p: ({ node, children, ...props }: { node?: any; children?: React.ReactNode; [key: string]: any }) => {
    if (typeof children === 'string') {
      // Replace inline math
      const parts = children.split(/(\$\$[\s\S]*?\$\$|\$[^\$]*?\$)/g);
      return (
        <p className="my-3 leading-relaxed whitespace-pre-wrap" {...props}>
          {parts.map((part, i) => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
              const math = part.slice(2, -2);
              return <BlockMath key={i} math={math} />;
            }
            if (part.startsWith('$') && part.endsWith('$')) {
              const math = part.slice(1, -1);
              return <InlineMath key={i} math={math} />;
            }
            return part;
          })}
        </p>
      );
    }
    return <p className="my-3 leading-relaxed whitespace-pre-wrap" {...props}>{children}</p>;
  },
  ul: ({ node, ...props }: { node?: any; [key: string]: any }) => (
    <ul className="list-disc pl-6 my-3" {...props} />
  ),
  ol: ({ node, ...props }: { node?: any; [key: string]: any }) => (
    <ol className="list-decimal pl-6 my-3" {...props} />
  ),
  li: ({ node, ...props }: { node?: any; [key: string]: any }) => (
    <li className="my-1" {...props} />
  ),
  strong: ({ node, ...props }: { node?: any; [key: string]: any }) => (
    <strong className="font-bold" {...props} />
  ),
  em: ({ node, ...props }: { node?: any; [key: string]: any }) => (
    <em className="italic" {...props} />
  ),
  code: CodeBlock,
  pre: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
    <pre className="bg-muted p-4 rounded-lg my-4 overflow-x-auto whitespace-pre-wrap" {...props}>
      {children}
    </pre>
  ),
};

const GRADING_CRITERIA = {
      0: {
        name: "Accepted",
        description: "Your solution is correct and meets all requirements"
    },
    1: {
        name: "Wrong Answer",
        description: "Your solution produces incorrect output"
    },
    2: {
        name: "Time Limit Exceeded",
        description: "Your solution takes too long to execute"
    },
    3: {
        name: "Memory Limit Exceeded",
        description: "Your solution uses too much memory"
    },
    4: {
        name: "Runtime Error",
        description: "Your solution crashes during execution"
    },
    5: {
        name: "Compile Error",
        description: "Your solution fails to compile"
    },
    6: {
        name: "Presentation Error",
        description: "Your solution output format is incorrect"
    }
};

interface TestDetailProps {
    test: {
        id: number;
        title: string;
        problemStatement: string;
        input_spec: string;
        output_spec: string;
        dueDate: string;
        status: string;
        questionId: number;
        initialCode: string;
        class_id: number;
        department_id: number;
        class?: {
            id: number;
            name: string;
            department: string;
        };
        department?: {
            id: number;
            name: string;
        };
        teacher?: {
            name: string;
        };
    };
    submission?: {
        id: number;
        status: string;
        created_at: string;
    };
    submissionWarning?: string;
}

export default function TestDetail({ test, submission, submissionWarning }: TestDetailProps) {
  return (
    <AppLayout title="Test">
      <div className="space-y-6">
        {/* First Row: Problem Statement + Code Editor */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Problem Statement Card */}
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{test.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {test.class?.name} • {test.class?.department}
                  </CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  Due: {new Date(test.dueDate).toLocaleString()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                <MarkdownRenderer 
                  content={`${test.problemStatement}\n\n## Input Specification\n\n${test.input_spec}\n\n## Output Specification\n\n${test.output_spec}`}
                  variant="default"
                />
              </div>
            </CardContent>
          </Card>

          {/* Code Editor - No Card Container */}
          <div className="flex flex-col">
            {submission ? (
              <Card>
                <CardHeader>
                  <CardTitle>Your Submission</CardTitle>
                  <CardDescription>
                    Submitted on {new Date(submission.created_at).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`text-xl font-medium ${
                    submission.status === 'Accepted' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Status: {submission.status}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <CodeEditor 
                  testId={test.id} 
                  questionId={test.questionId} 
                  initialCode={test.initialCode} 
                  className="h-[600px] border rounded-lg overflow-hidden"
                  test={{
                    id: test.id,
                    class_id: test.class_id,
                    department_id: test.department_id
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Second Row: Grading Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Grading Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(GRADING_CRITERIA).map(([id, { name, description }]) => (
                <div key={id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium min-w-[120px]">{name}</div>
                  <div className="text-sm text-muted-foreground">{description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {submissionWarning && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submissionWarning}</AlertDescription>
          </Alert>
        )}
      </div>
    </AppLayout>
  );
}

// Add this CSS to your global styles or create a new CSS module
const styles = `
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
`;
