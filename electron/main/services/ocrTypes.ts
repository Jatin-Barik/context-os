export interface OcrTextBlock {
  readonly text: string;
  readonly confidence: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface OcrParagraph {
  readonly text: string;
  readonly confidence: number;
  readonly blockCount: number;
}

export interface OcrTableCell {
  readonly text: string;
  readonly row: number;
  readonly column: number;
  readonly confidence: number;
}

export interface OcrTable {
  readonly rowCount: number;
  readonly columnCount: number;
  readonly cells: OcrTableCell[];
}

export interface OcrLayout {
  readonly orientation: 'portrait' | 'landscape' | 'square';
  readonly blocks: OcrTextBlock[];
  readonly paragraphs: OcrParagraph[];
  readonly tables: OcrTable[];
}

export interface OcrResult {
  readonly text: string;
  readonly blocks: OcrTextBlock[];
  readonly paragraphs: OcrParagraph[];
  readonly tables: OcrTable[];
  readonly layout: OcrLayout;
  readonly language: string;
  readonly confidence: number;
  readonly processingTimeMs: number;
  readonly source: 'paddleocr' | 'tesseract' | 'stub';
}
