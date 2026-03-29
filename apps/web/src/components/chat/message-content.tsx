import type { ChatRole } from '@repo/contracts';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { copyText } from '../../lib/clipboard';
import { Button } from '../ui/button';

interface MessageContentProps {
  content: string;
  messageRole: ChatRole;
}

const toPlainText = (children: ReactNode) => String(children).replace(/\n$/, '');

const CodeBlock = ({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) => {
  const language = className?.replace('language-', '') || 'text';
  const code = toPlainText(children);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await copyText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  if (!className?.includes('language-')) {
    return (
      <code
        className="rounded-md bg-slate-900 px-1.5 py-1 font-['Fira_Code'] text-[13px] text-emerald-200"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-3 py-2">
        <span className="font-['Fira_Code'] text-[11px] uppercase tracking-[0.22em] text-slate-500">
          {language}
        </span>
        <div className="flex items-center gap-2">
          {copied ? <span className="text-xs text-emerald-300">Copied</span> : null}
          <Button
            aria-label="코드 복사"
            onClick={() => void copy()}
            size="sm"
            type="button"
            variant="ghost"
          >
            Copy
          </Button>
        </div>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-6 text-slate-100">
        <code className="font-['Fira_Code']" {...props}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export const MessageContent = ({ content, messageRole }: MessageContentProps) => {
  if (messageRole !== 'assistant') {
    return <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7">{content}</p>;
  }

  return (
    <div className="message-markdown mt-3 text-[15px] leading-7 text-slate-100">
      <ReactMarkdown
        components={{
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-emerald-400/50 pl-4 text-slate-300">
              {children}
            </blockquote>
          ),
          code: CodeBlock,
          h1: ({ children }) => (
            <h1 className="text-2xl font-semibold tracking-tight">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold tracking-tight">{children}</h2>
          ),
          h3: ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>,
          li: ({ children }) => <li className="ml-5 list-disc pl-1">{children}</li>,
          ol: ({ children }) => <ol className="space-y-2">{children}</ol>,
          p: ({ children }) => <p>{children}</p>,
          table: ({ children }) => (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-800">
              <table className="min-w-full border-collapse text-left text-sm">{children}</table>
            </div>
          ),
          td: ({ children }) => <td className="border-t border-slate-800 px-3 py-2">{children}</td>,
          th: ({ children }) => (
            <th className="bg-slate-900/80 px-3 py-2 font-medium text-slate-200">{children}</th>
          ),
          ul: ({ children }) => <ul className="space-y-2">{children}</ul>,
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
