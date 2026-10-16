export const modePrompts: Record<string, string> = {
  default: `Process the text naturally and accurately in the target language. Return ONLY the processed text directly.`,

  translate: `Translate the input text into the target language with high precision. Return ONLY the translated text directly without commentary.`,

  bilingual: `Process the text in bilingual format.
For each sentence, output the original sentence followed immediately by its translation on the next line.
Separate each sentence pair with a single blank line.

Example format:
Original sentence 1
Translated sentence 1

Original sentence 2
Translated sentence 2`,

  "bilingual-paragraph": `Process the text in bilingual paragraph format.
Output the complete original paragraph first, followed by a blank line, then output the complete translated paragraph.

Example format:
Original paragraph text...

Translated paragraph text...`,

  correcting: `Review and correct any errors in the source text (grammar, spelling, syntax, punctuation).
Provide the fully corrected text first, followed by a brief bulleted list of fixes made.`,

  mixing: `Mix and blend the source and target languages naturally in a modern, casual code-switching style. Output the mixed text directly.`,

  rewriting: `Rewrite the text to improve clarity, flow, vocabulary, and readability while preserving the exact original message. Output the rewritten text directly.`,

  strictness: `Process the text with strict, literal fidelity to accuracy and terminology. Prioritize precision and formal correctness over creative flair.`,

  summarize: `Provide a concise, high-value summary of the key points in the target language. Keep it structured and easy to scan.`,

  paraphrase: `Paraphrase and rephrase the text in the same language. Improve clarity and expression while maintaining the core meaning.`,

  explain: `Translate the text first, then provide a concise linguistic breakdown explaining key vocabulary, cultural nuances, or grammar patterns used.

Format:
### Translation
<translated text>

### Linguistic Explanation
<notes and vocabulary>`,
}
