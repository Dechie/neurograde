declare module 'react-katex' {
  import { ComponentType } from 'react';

  interface MathProps {
    math: string;
    [key: string]: any;
  }

  export const InlineMath: ComponentType<MathProps>;
  export const BlockMath: ComponentType<MathProps>;
} 