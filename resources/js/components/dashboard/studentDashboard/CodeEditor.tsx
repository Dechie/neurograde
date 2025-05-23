import { Button } from '@/components/ui/button';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';
import { Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import { useToast } from '@/components/ui/use-toast';
import { linter, lintGutter, Diagnostic } from '@codemirror/lint';

// Import your custom theme and highlight style
import { myEditorTheme, myHighlightStyle } from '@/components/editor-theme/editor-theme';
import { syntaxHighlighting } from '@codemirror/language';

const STARTER_CODE = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    // Insert your code here
    cout << "Hello, World!" << endl;
    return 0;
}`,
    python: `def main():
    # Insert your code here
    print("Hello, World!")

if __name__ == "__main__":
    main()`
};

// Basic syntax error checking for C++
const cppLinter = linter(view => {
    const errors: Diagnostic[] = [];
    const content = view.state.doc.toString();
    
    // Check for missing semicolons
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        if (line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('/*') && 
            !line.trim().endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith('}') &&
            !line.includes('if') && !line.includes('for') && !line.includes('while') && 
            !line.includes('namespace') && !line.includes('using')) {
            errors.push({
                from: view.state.doc.line(i + 1).from,
                to: view.state.doc.line(i + 1).to,
                severity: 'warning' as const,
                message: 'Missing semicolon'
            });
        }
    });

    // Check for unclosed brackets
    let openBrackets = 0;
    for (let i = 0; i < content.length; i++) {
        if (content[i] === '{') openBrackets++;
        if (content[i] === '}') openBrackets--;
    }
    if (openBrackets !== 0) {
        errors.push({
            from: 0,
            to: content.length,
            severity: 'error' as const,
            message: 'Unclosed brackets'
        });
    }

    return errors;
});

// Basic syntax error checking for Python
const pythonLinter = linter(view => {
    const errors: Diagnostic[] = [];
    const content = view.state.doc.toString();
    
    // Check for indentation
    const lines = content.split('\n');
    let expectedIndent = 0;
    lines.forEach((line, i) => {
        if (line.trim() && !line.trim().startsWith('#')) {
            const indent = line.search(/\S|$/);
            if (indent % 4 !== 0) {
                errors.push({
                    from: view.state.doc.line(i + 1).from,
                    to: view.state.doc.line(i + 1).to,
                    severity: 'warning' as const,
                    message: 'Indentation should be a multiple of 4 spaces'
                });
            }
        }
    });

    // Check for missing colons after if/for/while/def
    lines.forEach((line, i) => {
        const trimmed = line.trim();
        if ((trimmed.startsWith('if ') || trimmed.startsWith('for ') || 
             trimmed.startsWith('while ') || trimmed.startsWith('def ')) && 
            !trimmed.endsWith(':')) {
            errors.push({
                from: view.state.doc.line(i + 1).from,
                to: view.state.doc.line(i + 1).to,
                severity: 'error' as const,
                message: 'Missing colon'
            });
        }
    });

    return errors;
});

interface CodeEditorProps {
    initialCode: string;
    testId: number;
    questionId: number;
    language?: 'cpp' | 'python';
    className?: string;
}

export function CodeEditor({ initialCode, testId, questionId, language: initialLanguage = 'cpp' ,className = '' }: CodeEditorProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python'>(initialLanguage);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing } = useForm({
        submission_type: 'editor',
        code_editor_text: initialCode || STARTER_CODE[selectedLanguage],
        test_id: testId,
        question_id: questionId,
        code_file: null as File | null,
        submission_date: new Date().toISOString(),
    });

    const onChange = (value: string) => {
        setData('code_editor_text', value);
    };

    const handleLanguageChange = (lang: 'cpp' | 'python') => {
        setSelectedLanguage(lang);
        setData('code_editor_text', STARTER_CODE[lang]);
    };

    const handleFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            // Check file extension based on selected language
            const allowedExtensions = {
                cpp: ['.cpp', '.hpp', '.h', '.c'],
                python: ['.py']
            };

            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            if (!allowedExtensions[selectedLanguage].includes(fileExtension)) {
                toast({
                    title: "Invalid File Type",
                    description: `Please upload a ${selectedLanguage === 'cpp' ? 'C++' : 'Python'} file (${allowedExtensions[selectedLanguage].join(', ')})`,
                    variant: "destructive",
                });
                return;
            }

            console.log('File Upload:', {
                fileName: file.name,
                fileSize: `${(file.size / 1024).toFixed(2)} KB`,
                fileType: file.type,
                language: selectedLanguage,
                testId,
                questionId
            });

            setData('code_file', file);
            setData('submission_type', 'file');
            
            // Read file content and update editor
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const content = event.target.result as string;
                    console.log('File Content Preview:', {
                        firstLine: content.split('\n')[0],
                        totalLines: content.split('\n').length,
                        contentLength: content.length
                    });
                    setData('code_editor_text', content);
                }
            };
            reader.readAsText(file);
        } catch (error) {
            console.error('File Upload Error:', error);
            toast({
                title: "File Upload Error",
                description: error instanceof Error ? error.message : "Failed to process file upload",
                variant: "destructive",
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || processing) return; // Prevent multiple submissions
        
        try {
            setIsSubmitting(true);
            
            // Update submission date before sending
            setData('submission_date', new Date().toISOString());
            
            // Log submission attempt with more details
            console.log('Submission Request:', {
                type: data.submission_type,
                testId,
                questionId,
                language: selectedLanguage,
                codeLength: data.code_editor_text.length,
                hasFile: !!data.code_file,
                fileName: data.code_file?.name,
                fileSize: data.code_file ? `${(data.code_file.size / 1024).toFixed(2)} KB` : null,
                timestamp: new Date().toISOString()
            });
            
            await post(route("student.tests.submit", { id: testId }), {
                method: 'post',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    // Log the complete response
                    console.log('Submission Response:', {
                        success: !!page.props.success,
                        error: page.props.error,
                        message: page.props.success || page.props.error,
                        timestamp: new Date().toISOString(),
                        props: page.props // Log all props for debugging
                    });

                    if (page.props.success) {
                        toast({
                            title: "Success",
                            description: String(page.props.success),
                        });
                        // Redirect to the test detail page instead of reloading
                        router.visit(route('student.tests.show', { id: testId }));
                    } else if (page.props.error) {
                        toast({
                            title: "Cannot Submit",
                            description: String(page.props.error),
                            variant: "destructive",
                        });
                    }
                },
                onError: (errors) => {
                    // Log detailed error information
                    console.error('Submission Error Details:', {
                        errors,
                        timestamp: new Date().toISOString(),
                        requestData: {
                            type: data.submission_type,
                            testId,
                            questionId,
                            language: selectedLanguage,
                            codeLength: data.code_editor_text.length,
                            hasFile: !!data.code_file,
                            fileName: data.code_file?.name
                        }
                    });

                    // Show all validation errors in the toast
                    const errorMessages = Object.entries(errors)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n');
                    
                    toast({
                        title: "Submission Error",
                        description: errorMessages || "Failed to submit. Please try again.",
                        variant: "destructive",
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                }
            });
        } catch (error) {
            // Log unexpected errors with full details
            console.error('Unexpected Submission Error:', {
                error,
                timestamp: new Date().toISOString(),
                requestData: {
                    type: data.submission_type,
                    testId,
                    questionId,
                    language: selectedLanguage,
                    codeLength: data.code_editor_text.length,
                    hasFile: !!data.code_file,
                    fileName: data.code_file?.name
                }
            });

            toast({
                title: "Submission Error",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
                variant: "destructive",
            });
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} method="POST" className={`border-muted overflow-hidden rounded-xl border bg-white shadow ${className}`}>
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Language:</span>
                    <div className="flex space-x-2">
                        <Button
                            type="button"
                            onClick={() => handleLanguageChange('cpp')}
                            variant={selectedLanguage === 'cpp' ? 'default' : 'outline'}
                            size="sm"
                        >
                            C++
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleLanguageChange('python')}
                            variant={selectedLanguage === 'python' ? 'default' : 'outline'}
                            size="sm"
                        >
                            Python
                        </Button>
                    </div>
                </div>
            </div>
            <CodeMirror
                value={data.code_editor_text}
                height="400px"
                
                theme={myEditorTheme}
                extensions={[
                    selectedLanguage === 'cpp' ? cpp() : python(),
                    syntaxHighlighting(myHighlightStyle),
                    lintGutter(),
                    selectedLanguage === 'cpp' ? cppLinter : pythonLinter,
                ]}
                onChange={onChange}
                basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    highlightActiveLine: true,
                    drawSelection: true,
                    dropCursor: true,
                    allowMultipleSelections: true,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    rectangularSelection: true,
                    crosshairCursor: true,
                    highlightActiveLineGutter: true,
                    highlightSelectionMatches: true,
                    closeBracketsKeymap: true,
                    searchKeymap: true,
                    foldKeymap: true,
                    completionKeymap: true,
                    lintKeymap: true,
                }}
                className="text-sm"
            />
            <div className="border-muted flex flex-col gap-2 border-t p-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept={selectedLanguage === 'cpp' ? '.cpp,.hpp,.h,.c' : '.py'}
                            className="hidden"
                        />
                        {!data.code_file ? (
                            <Button 
                                type="button"
                                variant="outline" 
                                className="gap-2" 
                                onClick={handleFileUpload}
                                aria-label="Upload Code"
                            >
                                <Upload className="h-4 w-4" />
                                Upload code as file
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    Selected file: {data.code_file.name}
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setData('code_file', null);
                                        setData('submission_type', 'editor');
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <Button 
                        type="submit"
                        aria-label="Submit Code"
                        disabled={isSubmitting || processing}
                    >
                        {isSubmitting || processing ? 'Submitting...' : 'Submit Code'}
                    </Button>
                </div>
                {data.code_file && (
                    <div className="text-sm text-muted-foreground">
                        <p>File will be submitted instead of the code in the editor.</p>
                        <p>Click the X button to remove the file and submit the code from the editor instead.</p>
                    </div>
                )}
            </div>
        </form>
    );
}
