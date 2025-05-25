import ReactMarkdown from 'react-markdown';
import { PrismAsync } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  variant?: 'default' | 'compact' | 'preview';
}

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

// Style variants for different use cases
const styleVariants = {
  default: {
    container: "prose prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-p:my-3 max-w-none",
    h1: "text-3xl font-bold my-4",
    h2: "text-2xl font-bold my-3",
    h3: "text-xl font-semibold my-2",
    p: "my-3 leading-relaxed whitespace-pre-wrap",
    ul: "list-disc pl-6 my-3",
    ol: "list-decimal pl-6 my-3",
    li: "my-1",
    pre: "bg-muted p-4 rounded-lg my-4 overflow-x-auto whitespace-pre-wrap"
  },
  compact: {
    container: "prose prose-sm max-w-none dark:prose-invert",
    h1: "text-2xl font-bold my-3",
    h2: "text-xl font-bold my-2",
    h3: "text-lg font-semibold my-2",
    p: "my-2 leading-relaxed whitespace-pre-wrap",
    ul: "list-disc pl-4 my-2",
    ol: "list-decimal pl-4 my-2",
    li: "my-0.5",
    pre: "bg-muted p-3 rounded-lg my-3 overflow-x-auto whitespace-pre-wrap"
  },
  preview: {
    container: "prose prose-sm max-w-none dark:prose-invert p-4 border rounded-md bg-muted/50 h-full overflow-auto",
    h1: "text-2xl font-bold my-3",
    h2: "text-xl font-bold my-2",
    h3: "text-lg font-semibold my-2",
    p: "my-2 leading-relaxed whitespace-pre-wrap",
    ul: "list-disc pl-4 my-2",
    ol: "list-decimal pl-4 my-2",
    li: "my-0.5",
    pre: "bg-muted p-3 rounded-lg my-3 overflow-x-auto whitespace-pre-wrap"
  }
};

export const MarkdownRenderer = ({ content, className, variant = 'default' }: MarkdownRendererProps) => {
  // Process the content to handle special characters and LaTeX expressions
  const processedContent = content
    .replace(/\\n/g, '\n')  // Convert \n to newlines
    .replace(/\\t/g, '    ') // Convert \t to 4 spaces
    .replace(/\\b/g, '\b')  // Convert \b to backspace
    .replace(/\\r/g, '\r')  // Convert \r to carriage return
    // Handle escaped LaTeX expressions
    .replace(/\\leq/g, '\\leq')  // Keep \leq as is
    .replace(/\\geq/g, '\\geq')  // Keep \geq as is
    .replace(/\\times/g, '\\times')  // Keep \times as is
    .replace(/\\ldots/g, '\\ldots')  // Keep \ldots as is
    .replace(/\\cdots/g, '\\cdots')  // Keep \cdots as is
    // Wrap LaTeX expressions in $ if they're not already wrapped
    .replace(/(?<!\$)(\\[a-zA-Z]+)(?!\$)/g, '$$1$')  // Wrap single LaTeX commands
    // Handle subscripts
    .replace(/(?<!\$)([A-Z]_\{[a-z0-9]\})(?!\$)/g, '$$1$')  // Wrap single subscripts like A_1
    .replace(/(?<!\$)([A-Z]_\{[a-z0-9]\}, [A-Z]_\{[a-z0-9]\})(?!\$)/g, '$$1$')  // Wrap multiple subscripts like A_1, A_2
    .replace(/(?<!\$)([A-Z]_\{[a-z0-9]\}, \ldots, [A-Z]_\{[a-z0-9]\})(?!\$)/g, '$$1$')  // Wrap sequences like A_1, ..., A_N
    // Handle other math expressions
    .replace(/(?<!\$)([0-9]+\\times[0-9]+\^[0-9]+)(?!\$)/g, '$$1$')  // Wrap expressions like 2\times10^5
    .replace(/(?<!\$)([0-9]+\\leq[^$]+)(?!\$)/g, '$$1$')  // Wrap expressions like 1\leq i < N
    // Handle any remaining LaTeX expressions that might have been missed
    .replace(/(?<!\$)([A-Z]_\{[^}]+\})(?!\$)/g, '$$1$');  // Catch any remaining subscripts

  const styles = styleVariants[variant];

  // Custom components for Markdown elements
  const components = {
    h1: ({ node, ...props }: { node?: any; [key: string]: any }) => (
      <h1 className={styles.h1} {...props} />
    ),
    h2: ({ node, ...props }: { node?: any; [key: string]: any }) => (
      <h2 className={styles.h2} {...props} />
    ),
    h3: ({ node, ...props }: { node?: any; [key: string]: any }) => (
      <h3 className={styles.h3} {...props} />
    ),
    p: ({ node, children, ...props }: { node?: any; children?: React.ReactNode; [key: string]: any }) => {
      if (typeof children === 'string') {
        // Replace inline math
        const parts = children.split(/(\$\$[\s\S]*?\$\$|\$[^\$]*?\$)/g);
        return (
          <p className={styles.p} {...props}>
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
      return <p className={styles.p} {...props}>{children}</p>;
    },
    ul: ({ node, ...props }: { node?: any; [key: string]: any }) => (
      <ul className={styles.ul} {...props} />
    ),
    ol: ({ node, ...props }: { node?: any; [key: string]: any }) => (
      <ol className={styles.ol} {...props} />
    ),
    li: ({ node, ...props }: { node?: any; [key: string]: any }) => (
      <li className={styles.li} {...props} />
    ),
    strong: ({ node, ...props }: { node?: any; [key: string]: any }) => (
      <strong className="font-bold" {...props} />
    ),
    em: ({ node, ...props }: { node?: any; [key: string]: any }) => (
      <em className="italic" {...props} />
    ),
    code: CodeBlock,
    pre: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
      <pre className={styles.pre} {...props}>
        {children}
      </pre>
    ),
  };

  return (
    <div className={cn(styles.container, className)}>
      <ReactMarkdown components={components}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}; 