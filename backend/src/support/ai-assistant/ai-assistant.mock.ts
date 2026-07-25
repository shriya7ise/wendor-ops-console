import { AiConversation, AiPersona } from './interfaces/ai-assistant.interface';

// PRD 3.2.3 — AI Assistant. Mock personas, suggested prompts, and seeded
// conversation history so the chat UI has something to render on first load.
export const AI_PERSONAS: AiPersona[] = [
  { id: 'ops', name: 'Operations Analyst', description: 'Machine health, failures, and refill planning.' },
  { id: 'finance', name: 'Finance Analyst', description: 'Revenue, settlements, and billing questions.' },
  { id: 'inventory', name: 'Inventory Analyst', description: 'Stock levels, purchase orders, and vendors.' },
];

export const AI_SUGGESTED_PROMPTS: string[] = [
  'Which machines had the most failures this week?',
  'Summarize today\'s sales versus yesterday.',
  'Which warehouse is closest to a stockout?',
  'Show me overdue invoices.',
  'Who are my top 5 performing vendors?',
];

export const MOCK_AI_CONVERSATIONS: AiConversation[] = [
  {
    id: 'CONV1001',
    title: 'Failure trend this week',
    personaId: 'ops',
    updatedAt: new Date(Date.now() - 3600_000).toISOString(),
    messages: [
      { id: 'M1', role: 'user', content: 'Which machines had the most failures this week?', createdAt: new Date(Date.now() - 3700_000).toISOString() },
      { id: 'M2', role: 'assistant', content: 'VM-2007 and VM-3010 logged the most failures this week, mostly card-reader and cooling faults. Lost revenue from these two machines is estimated at ₹18,400.', createdAt: new Date(Date.now() - 3600_000).toISOString() },
    ],
  },
  {
    id: 'CONV1002',
    title: 'Stockout risk check',
    personaId: 'inventory',
    updatedAt: new Date(Date.now() - 86_400_000).toISOString(),
    messages: [
      { id: 'M3', role: 'user', content: 'Which warehouse is closest to a stockout?', createdAt: new Date(Date.now() - 86_500_000).toISOString() },
      { id: 'M4', role: 'assistant', content: 'Gurgaon Warehouse has 3 SKUs under 15 units on hand, the lowest coverage of your four sites. I\'d recommend prioritizing a purchase order there.', createdAt: new Date(Date.now() - 86_400_000).toISOString() },
    ],
  },
];

const CANNED_RESPONSES: { match: RegExp; reply: string }[] = [
  { match: /fail|down|fault/i, reply: 'Failure analytics show a slight uptick in card-reader faults across 3 machines this week. Want a full breakdown by cluster?' },
  { match: /sale|revenue/i, reply: 'Sales are up 6.2% versus the same period last week, led by the North Delhi cluster.' },
  { match: /stock|inventory/i, reply: 'Two stock locations are below their reorder point. I can draft purchase orders for both if you\'d like.' },
  { match: /invoice|payment|billing/i, reply: 'You have 2 overdue invoices totaling ₹8,450. Want me to list them?' },
  { match: /vendor/i, reply: 'Balaji Distributors and Metro Beverages have the best on-time delivery rate over the last 90 days.' },
];

export function generateAiReply(question: string): string {
  const hit = CANNED_RESPONSES.find((c) => c.match.test(question));
  return hit ? hit.reply : `Here's a quick summary based on your current data: everything is broadly on track, with no critical alerts right now. (This is a mocked response for "${question}".)`;
}
