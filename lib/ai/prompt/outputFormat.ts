export const outputFormats: Record<string, string> = {
  default: `Output the processed text.
Do not include explanations unless requested.`,

  translate: `Output ONLY the translated text.
Do not include explanations.`,

  paraphrase: `Output ONLY the rewritten text.`,

  bilingual: `Output in bilingual format with original and translation for each sentence.
Separate each sentence pair with a blank line.`,

  "bilingual-paragraph": `Output in bilingual paragraph format.
First output the complete original paragraph, then output the complete translated paragraph.
Separate the two paragraphs with a blank line.`,

  correcting: `Output ONLY the corrected text.`,

  mixing: `Output the mixed language text naturally.`,

  rewriting: `Output ONLY the rewritten text.`,

  strictness: `Output the processed text with strict accuracy.`,

  summarize: `Output ONLY the summary.
Keep it concise and focused on key points.`,

  explain: `Output format:

Translation:
<translated text>

Explanation:
<short explanation>`,
}
