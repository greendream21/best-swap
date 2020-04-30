// Since Binance JS SDK does not support a *.d.ts file
// this is just a placeholder to avoid errors while importing it
declare module '@binance-chain/javascript-sdk'
declare module 'react-file-picker'
declare module 'styled-theme'

declare let $COMMIT_HASH: string;

declare module '*.otf';
declare module '*.png';
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
