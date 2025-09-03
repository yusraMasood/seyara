declare module 'react-native-html-to-pdf' {
  export interface Options {
    html: string;
    fileName?: string;
    directory?: string;
    base64?: boolean;
    width?: number;
    height?: number;
    padding?: number;
    bgColor?: string;
    font?: string;
  }

  export interface PDFResult {
    filePath?: string;
    base64?: string;
  }

  export function convert(options: Options): Promise<PDFResult>;

  const RNHTMLtoPDF: { convert: typeof convert };
  export default RNHTMLtoPDF;
}
