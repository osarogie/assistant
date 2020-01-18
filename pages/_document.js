import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { AppRegistry } from 'react-native-web'

export default class extends Document {
  static getInitialProps({ renderPage, req }) {
    AppRegistry.registerComponent('Main', () => Main)
    const { stylesheet, getStyleElement } = AppRegistry.getApplication('Main')
    const page = renderPage()
    const styles = (
      <>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {getStyleElement()}
      </>
    )

    return { ...page, styles }
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <title key="title">My Personal Assistant</title>
          <meta charSet="utf-8" />
          <meta name="keywords" content="goals, spending, planner, assistant" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
