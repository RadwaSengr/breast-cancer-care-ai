import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  HeartPulse,
  Loader2,
  Send,
  ShieldCheck,
  Siren,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";

export type Citation = { id: string; organization: string; url: string; label: string; title: string };
export type ChatAlert = { level: "urgent" | "emergency"; title: string; body: string; action: string };
export type QuestionSource = { id: number; documentId: number; title: string; organization: string; sourceUrl: string; pageFrom: number; pageTo: number; snippet: string };

export type PatientMessage = {
  id: string | number;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  questionSources?: QuestionSource[];
  suggestedQuestions?: string[];
  alert?: ChatAlert | null;
  feedback?: "up" | "down" | null;
};

/** Compatibility shape used by the template component showcase. */
export type Message = { role: "system" | "user" | "assistant"; content: string };

type Copy = {
  composerPlaceholder: string;
  send: string;
  thinking: string;
  emptyTitle: string;
  emptyBody: string;
  suggestedTitle: string;
  messageDisclaimer: string;
  sources: string;
  questionSources: string;
  questionSourcesNote: string;
  feedbackPrompt: string;
  feedbackUp: string;
  feedbackDown: string;
};

type AIChatBoxProps = {
  messages: Array<PatientMessage | Message>;
  onSendMessage: (content: string) => void;
  onFollowUp?: (question: string) => void;
  onFeedback?: (messageId: number, feedback: "up" | "down") => void;
  isLoading?: boolean;
  disabled?: boolean;
  language?: "ar" | "en";
  copy?: Copy;
  placeholder?: string;
  height?: string | number;
  emptyStateMessage?: string;
  suggestedPrompts?: string[];
};

const DEFAULT_COPY: Copy = {
  composerPlaceholder: "Type your message…", send: "Send", thinking: "Thinking…", emptyTitle: "Start a conversation",
  emptyBody: "Ask a question to begin.", suggestedTitle: "Suggested questions", messageDisclaimer: "Educational information only.", sources: "Sources", questionSources: "Question sources", questionSourcesNote: "Trusted source excerpts used to understand your question", feedbackPrompt: "Was this helpful?", feedbackUp: "Helpful", feedbackDown: "Not helpful",
};

function renderSourceLinks(value: string) {
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = linkPattern.exec(value)) !== null) {
    if (match.index > cursor) nodes.push(value.slice(cursor, match.index));
    nodes.push(
      <a key={`source-link-${key}`} href={match[2]} target="_blank" rel="noreferrer">
        {match[1]}
      </a>,
    );
    cursor = match.index + match[0].length;
    key += 1;
  }

  if (cursor < value.length) nodes.push(value.slice(cursor));
  return nodes.length ? nodes : value;
}

function LightweightAnswer({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/).filter(Boolean);

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").map(line => line.trim()).filter(Boolean);
        const isList = lines.length > 0 && lines.every(line => /^[-*•]\s+/.test(line));

        if (isList) {
          return (
            <ul key={`answer-list-${blockIndex}`} className="list-disc space-y-1 ps-5">
              {lines.map((line, lineIndex) => <li key={`answer-list-item-${lineIndex}`}>{renderSourceLinks(line.replace(/^[-*•]\s+/, ""))}</li>)}
            </ul>
          );
        }

        return (
          <p key={`answer-paragraph-${blockIndex}`}>
            {lines.map((line, lineIndex) => (
              <Fragment key={`answer-line-${lineIndex}`}>
                {renderSourceLinks(line)}
                {lineIndex < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Specialized version of the template chat component, extended with medical-safety
 * metadata, inline-source support, and guided patient follow-up prompts.
 */
export function AIChatBox({
  messages,
  onSendMessage,
  onFollowUp = onSendMessage,
  onFeedback,
  isLoading = false,
  disabled = false,
  language = "en",
  copy = DEFAULT_COPY,
  placeholder,
  height,
  emptyStateMessage,
  suggestedPrompts,
}: AIChatBoxProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isLoading]);

  const submit = () => {
    const value = input.trim();
    if (!value || isLoading || disabled) return;
    onSendMessage(value);
    setInput("");
    window.setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const isArabic = language === "ar";
  const visibleMessages: PatientMessage[] = messages
    .filter((message): message is PatientMessage | Message => message.role !== "system")
    .map((message, index) => ({
      id: "id" in message ? message.id : `legacy-${index}`,
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content,
      citations: "citations" in message ? message.citations : undefined,
      questionSources: "questionSources" in message ? message.questionSources : undefined,
      suggestedQuestions: "suggestedQuestions" in message ? message.suggestedQuestions : undefined,
      alert: "alert" in message ? message.alert : undefined,
      feedback: "feedback" in message ? message.feedback : undefined,
    }));
  const emptyPrompts = suggestedPrompts ?? [
    isArabic ? "كيف أستعد لموعدي التالي؟" : "How can I prepare for my next appointment?",
    isArabic ? "ما الأعراض التي ينبغي أن أبلغ عنها فريقي؟" : "Which symptoms should I report to my care team?",
    isArabic ? "ما الدعم المتاح خلال التعافي؟" : "What support is available during recovery?",
  ];

  return (
    <section className="chat-shell min-h-[650px] overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_-35px_rgba(15,47,73,0.5)]" style={height ? { height } : undefined}>
      <div className="flex min-h-[650px] flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-7" aria-live="polite">
          {visibleMessages.length === 0 ? (
            <div className="flex min-h-[430px] flex-col items-center justify-center px-4 text-center">
              <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-teal-50 text-teal-700 shadow-sm">
                <HeartPulse className="size-8" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">{emptyStateMessage ?? copy.emptyTitle}</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">{emptyStateMessage ? copy.emptyBody : copy.emptyBody}</p>
              <div className="mt-8 flex max-w-xl flex-wrap justify-center gap-2.5">
                {emptyPrompts.map(prompt => (
                  <button
                    className="rounded-full border border-teal-100 bg-teal-50/55 px-4 py-2 text-sm font-medium text-teal-800 transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 disabled:opacity-50"
                    key={prompt}
                    disabled={disabled || isLoading}
                    onClick={() => onFollowUp(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : visibleMessages.map(message => (
            <article
              key={message.id}
              className={cn("flex max-w-[92%] flex-col gap-2 sm:max-w-[84%]", message.role === "user" ? "self-end" : "self-start")}
            >
              {message.alert && (
                <div
                  className={cn(
                    "safety-alert rounded-2xl border p-4 shadow-sm",
                    message.alert.level === "emergency"
                      ? "border-rose-300 bg-rose-50 text-rose-950"
                      : "border-amber-300 bg-amber-50 text-amber-950",
                  )}
                  role="alert"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
                      message.alert.level === "emergency" ? "bg-rose-600 text-white" : "bg-amber-500 text-white",
                    )}>
                      {message.alert.level === "emergency" ? <Siren className="size-5" /> : <TriangleAlert className="size-5" />}
                    </div>
                    <div className="min-w-0 text-start">
                      <h3 className="font-display text-base font-bold">{message.alert.title}</h3>
                      <p className="mt-1 text-sm leading-6">{message.alert.body}</p>
                      <p className="mt-2 text-sm font-bold leading-6">{message.alert.action}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className={cn("flex items-end gap-2.5", message.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "mb-1 flex size-8 shrink-0 items-center justify-center rounded-xl",
                  message.role === "user" ? "bg-slate-100 text-slate-600" : "bg-teal-100 text-teal-800",
                )}>
                  {message.role === "user" ? <UserRound className="size-4" /> : <Sparkles className="size-4" />}
                </div>
                <div className={cn(
                  "min-w-0 rounded-2xl px-4 py-3.5 text-start text-[0.94rem] leading-7 shadow-sm",
                  message.role === "user"
                    ? "rounded-ee-md bg-slate-900 text-white"
                    : "rounded-es-md border border-slate-100 bg-slate-50 text-slate-700",
                )}>
                  {message.role === "assistant" ? (
                    <div className="medical-prose max-w-none text-inherit [&_a]:font-semibold [&_a]:text-teal-800 [&_a]:underline [&_a]:decoration-teal-300 [&_a]:underline-offset-2">
                      <LightweightAnswer content={message.content} />
                    </div>
                  ) : <p className="whitespace-pre-wrap">{message.content}</p>}
                </div>
              </div>

              {message.role === "assistant" && (
                <div className="ms-10 rounded-xl border border-slate-100 bg-white px-3.5 py-3 text-start shadow-sm">
                  {message.citations && message.citations.length > 0 && (
                    <div className="mb-3 border-b border-slate-100 pb-3">
                      <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.13em] text-slate-400">{copy.sources}</p>
                      <div className="flex flex-wrap gap-2">
                        {message.citations.map(citation => (
                          <a
                            key={citation.id}
                            href={citation.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 transition hover:bg-teal-100"
                          >
                            {citation.label.replace(/[\[\]]/g, "")}
                            <ExternalLink className="size-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-teal-700" />
                    <p>{copy.messageDisclaimer}</p>
                  </div>
                  {onFeedback && typeof message.id === "number" && (
                    <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                      <span className="me-1 text-xs font-medium text-slate-500">{copy.feedbackPrompt}</span>
                      <button
                        type="button"
                        onClick={() => onFeedback(message.id as number, "up")}
                        aria-label={copy.feedbackUp}
                        className={cn("inline-flex size-7 items-center justify-center rounded-lg border transition", message.feedback === "up" ? "border-teal-300 bg-teal-50 text-teal-800" : "border-slate-200 text-slate-500 hover:border-teal-200 hover:text-teal-800")}
                      ><ThumbsUp className="size-3.5" /></button>
                      <button
                        type="button"
                        onClick={() => onFeedback(message.id as number, "down")}
                        aria-label={copy.feedbackDown}
                        className={cn("inline-flex size-7 items-center justify-center rounded-lg border transition", message.feedback === "down" ? "border-rose-300 bg-rose-50 text-rose-700" : "border-slate-200 text-slate-500 hover:border-rose-200 hover:text-rose-700")}
                      ><ThumbsDown className="size-3.5" /></button>
                    </div>
                  )}
                </div>
              )}

              {message.role === "assistant" && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                <div className="ms-10 mt-1 text-start">
                  <p className="mb-2 text-xs font-semibold text-slate-500">{copy.suggestedTitle}</p>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestedQuestions.map(question => (
                      <button
                        key={question}
                        disabled={isLoading || disabled}
                        onClick={() => onFollowUp(question)}
                        className="rounded-full border border-teal-100 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 shadow-sm transition hover:-translate-y-px hover:border-teal-300 hover:bg-teal-50 disabled:opacity-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2.5 self-start">
              <div className="mb-1 flex size-8 items-center justify-center rounded-xl bg-teal-100 text-teal-800"><Sparkles className="size-4" /></div>
              <div className="flex items-center gap-2 rounded-2xl rounded-es-md border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin text-teal-700" /> {copy.thinking}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(event) => { event.preventDefault(); submit(); }}
          className="border-t border-slate-100 bg-white px-4 py-4 sm:px-6"
        >
          <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-teal-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-50">
            <Textarea
              ref={textareaRef}
              value={input}
              disabled={disabled || isLoading}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit();
                }
              }}
              placeholder={placeholder ?? copy.composerPlaceholder}
              rows={1}
              className="min-h-11 max-h-32 resize-none border-0 bg-transparent px-3 py-2.5 text-sm leading-6 shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              disabled={!input.trim() || disabled || isLoading}
              aria-label={copy.send}
              className="size-11 shrink-0 rounded-xl bg-teal-700 text-white shadow-sm transition hover:bg-teal-800 active:scale-[0.97]"
            >
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
