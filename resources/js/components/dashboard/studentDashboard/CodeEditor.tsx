import { Button } from '@/components/ui/button';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
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
}

export function CodeEditor({ initialCode, testId, questionId, language: initialLanguage = 'cpp' }: CodeEditorProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python'>(initialLanguage);

    const { data, setData, post, processing } = useForm({
        submission_type: 'editor',
        code_editor_text: initialCode || STARTER_CODE[selectedLanguage],
        test_id: testId,
        question_id: questionId,
    });

    const onChange = (value: string) => {
        setData('code_editor_text', value);
    };

    const handleLanguageChange = (lang: 'cpp' | 'python') => {
        setSelectedLanguage(lang);
        setData('code_editor_text', STARTER_CODE[lang]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        post(route("student.tests.submit", { test: testId }), {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Code submitted successfully",
                });
                console.log('Code submitted successfully');
            },
            onError: (errors) => {
                toast({
                    title: "Error",
                    description: errors.message || "Failed to submit code",
                    variant: "destructive",
                });
                console.error('Failed to submit code:', errors);
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="border-muted overflow-hidden rounded-xl border bg-white shadow">
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
            <div className="border-muted flex justify-between border-t p-2">
                <Button 
                    type="button"
                    variant="outline" 
                    className="gap-2" 
                    aria-label="Upload Code"
                >
                    <Upload className="h-4 w-4" />
                    Upload code as file
                </Button>
                <Button 
                    type="submit"
                    aria-label="Submit Code"
                    disabled={isSubmitting || processing}
                >
                    {isSubmitting || processing ? 'Submitting...' : 'Submit Code'}
                </Button>
            </div>
        </form>
    );
}
