import { JSON_OUTPUT_INSTRUCTION } from "./jsonOutputSchema"

export const modePrompts: Record<string, string> = {
  default: `Process the text naturally.

${JSON_OUTPUT_INSTRUCTION}`,

  bilingual: `Process the text in bilingual format.
For each sentence, output the original sentence followed by its translation.
Separate each sentence pair with a blank line.

Example format:
Original sentence 1
Translated sentence 1

Original sentence 2
Translated sentence 2

${JSON_OUTPUT_INSTRUCTION}

For bilingual mode, your JSON MUST include:
{
  "result": "full bilingual text with line breaks",
  "bilingual": [
    {"original": "sentence 1", "translation": "translation 1", "index": 1}
  ]
}`,

  "bilingual-paragraph": `Process the text in bilingual paragraph format.
Output the complete original paragraph first, then output the complete translated paragraph.
Separate the two paragraphs with a blank line.

Example format:
Original paragraph (all sentences together)

Translated paragraph (all sentences together)

${JSON_OUTPUT_INSTRUCTION}

For bilingual-paragraph mode, your JSON MUST include:
{
  "result": "full bilingual text",
  "bilingual": [
    {"original": "full original paragraph", "translation": "full translated paragraph"}
  ]
}`,

  correcting: `Review and correct any errors in the text.
Fix grammar, spelling, and punctuation mistakes.

${JSON_OUTPUT_INSTRUCTION}

For correcting mode, your JSON MUST include:
{
  "result": "corrected text",
  "corrections": [
    {"original": "mistake", "corrected": "fix", "type": "grammar|spelling|punctuation", "reason": "why"}
  ]
}`,

  mixing: `Mix and blend the source and target languages naturally.
Create a code-switched output that flows well.

${JSON_OUTPUT_INSTRUCTION}`,

  rewriting: `Rewrite the text to improve clarity, flow, and readability.
Maintain the original meaning but enhance the expression.

${JSON_OUTPUT_INSTRUCTION}`,

  strictness: `Process the text with strict adherence to accuracy.
Prioritize precision over creativity.

${JSON_OUTPUT_INSTRUCTION}`,

  summarize: `Provide a concise summary of the key points.
Capture the essential information in fewer words.

${JSON_OUTPUT_INSTRUCTION}

For summarizing mode, your JSON MUST include:
{
  "result": "summary text",
  "summary": "brief summary"
}`,

  translate: `Translate the following text to the target language.
Preserve the meaning as accurately as possible.

${JSON_OUTPUT_INSTRUCTION}`,

  paraphrase: `Rewrite the text in the same language.
Improve clarity and readability while keeping the original meaning.

${JSON_OUTPUT_INSTRUCTION}`,

  explain: `Translate the text and then explain the important grammar or vocabulary.

${JSON_OUTPUT_INSTRUCTION}

For explain mode, your JSON MUST include:
{
  "result": "translation with explanation",
  "explanation": "detailed explanation of grammar/vocabulary"
}`,
}
