import ReactMarkdown from 'react-markdown';
import { PrismAsync } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
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
  const language = match ? match[1] : 'text';
  
  return !inline ? (
    <div className="relative">
      <PrismAsync
        language={language}
        style={atomDark as any}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: '0.375rem',
          backgroundColor: 'rgb(40, 42, 54)',
          padding: '1rem'
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </PrismAsync>
      <div className="absolute top-2 right-2 text-xs text-gray-400">
        {language}
      </div>
    </div>
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
    pre: "bg-muted p-4 rounded-lg my-4 overflow-x-auto"
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
    pre: "bg-muted p-3 rounded-lg my-3 overflow-x-auto"
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
    pre: "bg-muted p-3 rounded-lg my-3 overflow-x-auto"
  }
};

export const MarkdownRenderer = ({ content, className, variant = 'default' }: MarkdownRendererProps) => {
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
    p: ({ node, children, ...props }: { node?: any; children?: React.ReactNode; [key: string]: any }) => (
      <p className={styles.p} {...props}>{children}</p>
    ),
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
        {content}
      </ReactMarkdown>
    </div>
  );
}; 