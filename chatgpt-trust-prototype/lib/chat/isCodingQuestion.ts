/** True when the user is asking for code / implementation help. */
export function isCodingQuestion(text: string): boolean {
  return /\b(write|implement|code|debug|fix|solve|algorithm|function|class|java|python|javascript|typescript|leetcode|compile|syntax|program)\b/i.test(
    text.trim(),
  );
}
