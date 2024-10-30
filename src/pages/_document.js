import Document, { Html, Head, Main, NextScript } from 'next/document'
import { collectStyles } from '@/utils/styleUtils'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    return collectStyles(ctx);
  }

  render() {
    return (
      <Html lang="es">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
