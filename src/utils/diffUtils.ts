export interface DiffLine {
  content: string;
  type: 'normal' | 'added' | 'removed' | 'modified';
  lineNumber?: number;
}

export interface DiffResult {
  leftLines: DiffLine[];
  rightLines: DiffLine[];
  stats: {
    added: number;
    removed: number;
    modified: number;
    similarity: number;
  };
}

export function compareLinesWithWords(text1: string, text2: string): DiffResult {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  
  const leftLines: DiffLine[] = [];
  const rightLines: DiffLine[] = [];
  
  let added = 0;
  let removed = 0;
  let modified = 0;
  
  const maxLength = Math.max(lines1.length, lines2.length);
  
  for (let i = 0; i < maxLength; i++) {
    const line1 = lines1[i] || '';
    const line2 = lines2[i] || '';
    
    if (i >= lines1.length) {
      // Line only exists in text2 (added)
      rightLines.push({
        content: line2,
        type: 'added',
        lineNumber: i + 1
      });
      leftLines.push({
        content: '',
        type: 'normal'
      });
      added++;
    } else if (i >= lines2.length) {
      // Line only exists in text1 (removed)
      leftLines.push({
        content: line1,
        type: 'removed',
        lineNumber: i + 1
      });
      rightLines.push({
        content: '',
        type: 'normal'
      });
      removed++;
    } else if (line1 === line2) {
      // Lines are identical
      leftLines.push({
        content: line1,
        type: 'normal',
        lineNumber: i + 1
      });
      rightLines.push({
        content: line2,
        type: 'normal',
        lineNumber: i + 1
      });
    } else {
      // Lines are different (modified)
      leftLines.push({
        content: line1,
        type: 'modified',
        lineNumber: i + 1
      });
      rightLines.push({
        content: line2,
        type: 'modified',
        lineNumber: i + 1
      });
      modified++;
    }
  }
  
  // Calculate similarity percentage
  const totalLines = Math.max(lines1.length, lines2.length);
  const unchangedLines = totalLines - added - removed - modified;
  const similarity = totalLines > 0 ? Math.round((unchangedLines / totalLines) * 100) : 100;
  
  return {
    leftLines,
    rightLines,
    stats: {
      added,
      removed,
      modified,
      similarity
    }
  };
}

export function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/).filter(Boolean);
  const words2 = text2.toLowerCase().split(/\s+/).filter(Boolean);
  
  if (words1.length === 0 && words2.length === 0) return 100;
  if (words1.length === 0 || words2.length === 0) return 0;
  
  const commonWords = words1.filter(word => words2.includes(word));
  const totalWords = Math.max(words1.length, words2.length);
  
  return Math.round((commonWords.length / totalWords) * 100);
}