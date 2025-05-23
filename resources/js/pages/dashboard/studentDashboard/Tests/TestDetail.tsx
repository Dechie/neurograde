import { CodeEditor } from '@/components/dashboard/studentDashboard/CodeEditor';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppLayout } from '@/layouts/dashboard/studentDashboard/studentDashboardLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PrismAsync } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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
    <code className="bg-gray-100 px-1 rounded" {...props}>
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
  p: ({ node, ...props }: { node?: any; [key: string]: any }) => (
    <p className="my-3 leading-relaxed" {...props} />
  ),
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
        dueDate: string;
        status: string;
        questionId: number;
        initialCode: string;
        class?: {
            name: string;
            department: string;
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
            <CardContent className="prose prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-p:my-3 max-w-none">
              <ReactMarkdown components={MarkdownComponents}>
                {test.problemStatement}
              </ReactMarkdown>
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
                  className="h-[500px] border rounded-lg overflow-hidden"
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




// import { CodeEditor } from '@/components/dashboard/studentDashboard/CodeEditor';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { AppLayout } from '@/layouts/dashboard/studentDashboard/studentDashboardLayout';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { AlertCircle } from 'lucide-react';

// // Define the global grading criteria
// const GRADING_CRITERIA: Record<number, { name: string; description: string }> = {
//     0: {
//         name: "Accepted",
//         description: "Your solution is correct and meets all requirements"
//     },
//     1: {
//         name: "Wrong Answer",
//         description: "Your solution produces incorrect output"
//     },
//     2: {
//         name: "Time Limit Exceeded",
//         description: "Your solution takes too long to execute"
//     },
//     3: {
//         name: "Memory Limit Exceeded",
//         description: "Your solution uses too much memory"
//     },
//     4: {
//         name: "Runtime Error",
//         description: "Your solution crashes during execution"
//     },
//     5: {
//         name: "Compile Error",
//         description: "Your solution fails to compile"
//     },
//     6: {
//         name: "Presentation Error",
//         description: "Your solution output format is incorrect"
//     }
// };

// interface TestDetailProps {
//     test: {
//         id: number;
//         title: string;
//         problemStatement: string;
//         dueDate: string;
//         status: string;
//         questionId: number;
//         initialCode: string;
//         class?: {
//             name: string;
//             department: string;
//         };
//         teacher?: {
//             name: string;
//         };
//     };
//     submission?: {
//         id: number;
//         status: string;
//         created_at: string;
//     };
//     submissionWarning?: string;
// }

// export default function TestDetail({ test, submission, submissionWarning }: TestDetailProps) {
//     return (
//         <AppLayout title="Test">
//             <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-4">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>{test.title}</CardTitle>
//                             <CardDescription>
//                                 {test.class?.name} • {test.class?.department}
//                                 {test.teacher && <span> • Teacher: {test.teacher.name}</span>}
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent className="prose max-w-none">
//                             <p className="text-black">{test.problemStatement}</p>
//                         </CardContent>
//                         <CardFooter className="mt-auto border-t p-4">
//                             <p className="text-muted-foreground text-sm">Due Date: {test.dueDate}</p>
//                         </CardFooter>
//                     </Card>

//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Grading Criteria</CardTitle>
//                             <CardDescription>Possible verdicts for your submission</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="space-y-3">
//                                 {Object.entries(GRADING_CRITERIA).map(([id, { name, description }]) => (
//                                     <div key={id} className="space-y-1">
//                                         <span className="font-medium text-foreground">{name}</span>
//                                         <p className="text-sm text-muted-foreground">{description}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 <div className="space-y-4">
//                     {submissionWarning && (
//                         <Alert variant="destructive">
//                             <AlertCircle className="h-4 w-4" />
//                             <AlertDescription>{submissionWarning}</AlertDescription>
//                         </Alert>
//                     )}

//                     {submission ? (
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Your Submission</CardTitle>
//                                 <CardDescription>
//                                     Submitted on {new Date(submission.created_at).toLocaleString()}
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <p className="text-muted-foreground">
//                                     You have already submitted this test. The status is: {submission.status}
//                                 </p>
//                             </CardContent>
//                         </Card>
//                     ) : (
//                         <CodeEditor 
//                             testId={test.id} 
//                             questionId={test.questionId} 
//                             initialCode={test.initialCode} 
//                         />
//                     )}
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }
