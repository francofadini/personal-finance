import Document, { Html, Head, Main, NextScript } from 'next/document'
import { collectStyles } from '@/utils/styleUtils'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    return collectStyles(ctx);
  }

  render() {
    return (
      <Html lang="es">
        <Head>
          <meta 
            name="viewport" 
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
