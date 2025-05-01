import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function CodeEditor() {
  const [code, setCode] = useState(`# Type your Python code ->

print("Hello World!")
# A palindrome function
def is_palindrome(s):
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]
`);

  const onChange = (value: string) => {
    setCode(value);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-muted bg-white shadow">
      <CodeMirror
        value={code}
        height="400px"
        theme={vscodeLight}
        extensions={[python()]}
        onChange={onChange}
        className="text-sm"
      />
      <div className="p-2 flex justify-between border-t">
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload code as file
        </Button>
        <Button>Submit Code</Button>
      </div>
    </div>
  );
}
