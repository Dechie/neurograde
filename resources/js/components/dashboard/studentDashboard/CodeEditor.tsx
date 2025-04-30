import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";

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
    <div className="h-[400px] rounded-xl overflow-hidden border border-muted bg-white shadow">
      <CodeMirror
        value={code}
        height="400px"
        theme={vscodeLight}
        extensions={[python()]}
        onChange={onChange}
        className="text-sm"
      />
    </div>
  );
}


