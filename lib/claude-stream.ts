// Server-only: stream a Claude reply to the browser as plain text.
import Anthropic from '@anthropic-ai/sdk';

export const ADVISOR_MODEL = 'claude-sonnet-5-5';
export const STREAM_ERROR_MARKER = '[[ADVISOR_ERROR]]';

export function streamClaude(opts: {
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  maxTokens: number;
  /** Called with the full text once the reply finished without errors. */
  onComplete: (full: string) => Promise<void>;
}): Response {
  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = '';
      try {
        const response = client.messages.stream({
          model: ADVISOR_MODEL,
          max_tokens: opts.maxTokens,
          system: opts.system,
          messages: opts.messages,
        });
        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            full += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await response.finalMessage();
        if (final.stop_reason !== 'end_turn') {
          // A cut-off reply must be visible in the logs.
          console.error(`Advisor reply stopped early: ${final.stop_reason}`);
        }
        if (full.trim()) await opts.onComplete(full);
      } catch (error) {
        console.error('Claude stream error:', error);
        controller.enqueue(encoder.encode(`\n\n${STREAM_ERROR_MARKER}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
