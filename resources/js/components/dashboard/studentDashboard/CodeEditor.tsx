import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

// Import your custom theme and highlight style
import { myEditorTheme, myHighlightStyle } from '@/components/editor-theme/editor-theme';
import { syntaxHighlighting } from "@codemirror/language"; // Add syntaxHighlighting from the correct package

export function CodeEditor() {
  const [code, setCode] = useState(`# Type your C++ code ->

#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`);

  const onChange = (value: string) => {
    setCode(value);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-muted bg-white shadow">
      <CodeMirror
        value={code}
        height="400px"
        theme={myEditorTheme}
        extensions={[
          cpp(), // C++ language extension
          syntaxHighlighting(myHighlightStyle), // Wrap myHighlightStyle with syntaxHighlighting
        ]}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
        }}
        className="text-sm"
      />
      <div className="p-2 flex justify-between border-t border-muted">
        <Button variant="outline" className="gap-2" aria-label="Upload Code">
          <Upload className="h-4 w-4" />
          Upload code as file
        </Button>
        <Button aria-label="Submit Code">Submit Code</Button>
      </div>
    </div>
  );
}
