import { attributeSelector } from '$utils/attributes';
import { createCleanup, type Destroyable } from '$utils/cleanup';
import { createInstances } from '$utils/createInstances';
import { on } from '$utils/events';
import { createLogger } from '$utils/log';

const TRIGGER = attributeSelector('ask-ai');
const PROMPT_ATTR = 'data-ask-ai-prompt';

/** Used when no `data-ask-ai-prompt` is set on the button or an ancestor. */
const FALLBACK_PROMPT =
  "I'm evaluating Adfin (https://adfin.com) as a payments and credit control platform for my business. Please visit their site and summarise: what they do, who they're for, how they compare to invoicing through my accounting software alone, and any strengths or weaknesses I should consider. Keep it concise and neutral.";

const TOOLS: Record<string, string> = {
  chatgpt: 'https://chatgpt.com/?q=',
  perplexity: 'https://www.perplexity.ai/search/new?q=',
  claude: 'https://claude.ai/new?q=',
  gemini: 'https://www.google.com/search?udm=50&aep=11&q=',
};

const log = createLogger('askAi');

/** The prompt attribute may sit on a wrapper — CMS bindings sometimes expose
 * attributes higher up the tree — so walk ancestors before falling back. */
const resolvePrompt = (el: HTMLElement): string => {
  let node: HTMLElement | null = el;
  while (node && node !== document.body) {
    const value = node.getAttribute(PROMPT_ATTR);
    if (value?.trim()) return value.trim();
    node = node.parentElement;
  }
  return FALLBACK_PROMPT;
};

/**
 * `data-ask-ai="chatgpt|perplexity|claude|gemini"` on a button opens that
 * assistant in a new tab with the prompt prefilled. The prompt comes from
 * `data-ask-ai-prompt` (typically CMS-bound) on the button or an ancestor.
 */
const createAskAi = (trigger: HTMLElement): Destroyable | null => {
  const tool = TOOLS[trigger.getAttribute('data-ask-ai') ?? ''];
  if (!tool) return null;

  const cleanup = createCleanup();
  cleanup.add(
    on(trigger, 'click', (event) => {
      event.preventDefault();
      window.open(tool + encodeURIComponent(resolvePrompt(trigger)), '_blank', 'noopener');
    })
  );

  return { destroy: () => cleanup.run() };
};

export const askAi = (): void => {
  const instances = createInstances(TRIGGER, createAskAi).filter(
    (instance): instance is Destroyable => instance !== null
  );
  log('instances', instances.length);
};
