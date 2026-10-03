import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Callout, type CalloutProps } from 'fumadocs-ui/components/callout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'fumadocs-ui/components/accordion';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Card, Cards } from 'fumadocs-ui/components/card';
import type { ReactNode } from 'react';
import { SeverityBadge } from '@/components/principle-meta';

/**
 * Custom Principai components.
 * Severity badges and section blocks used inside principle files.
 */
function Severity({ level }: { level: 'critical' | 'important' | 'advisory' }) {
  return <SeverityBadge level={level} />;
}

function AIInstruction({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 rounded-xl border border-[#0282D8]/30 bg-[#0282D8]/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0282D8]">
        <span aria-hidden>⚡</span> Instruction for AI agents
      </div>
      <div className="text-[15px] leading-relaxed text-white/90 [&>p]:m-0">{children}</div>
    </div>
  );
}

function Enforcement({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 rounded-xl border border-emerald-400/25 bg-emerald-400/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
        <span aria-hidden>🛡️</span> Technical enforcement — controls beyond prompts
      </div>
      <div className="text-[15px] leading-relaxed text-white/90 [&>p]:m-0">{children}</div>
    </div>
  );
}

function RealCase({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 rounded-xl border border-[#4D4B5B]/50 bg-[#4D4B5B]/10 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#a8a5bd]">
        <span aria-hidden>📋</span> Real-world damage when violated
      </div>
      <div className="text-[15px] leading-relaxed text-white/90 [&>p]:m-0">{children}</div>
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Callout,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    File,
    Files,
    Folder,
    Card,
    Cards,
    Severity,
    AIInstruction,
    Enforcement,
    RealCase,
    ...components,
  };
}
