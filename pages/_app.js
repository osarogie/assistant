import 'antd/dist/antd.css'
import '../src/app.css'
import React, { StrictMode } from 'react'
import App from 'next/app'

import 'firebase/performance'
import dynamic from 'next/dynamic'
import {
  preloadFirestoreDoc,
  useFirebaseApp,
  preloadUser,
  preloadAuth,
  preloadFirestore,
  preloadDatabase,
  preloadStorage
} from 'reactfire'

import NProgress from 'nprogress'
import Router from 'next/router'

NProgress.configure({
  template: `
    <div class="bar" role="bar"></div>
    <div class="slider">
      <div class="line"></div>
      <div class="subline inc"></div>
      <div class="subline dec"></div>
    </div>
  `
})

Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

// Our components will lazy load the
// SDKs to decrease their bundle size.
// Since we know that, we can start
// fetching them now
const preloadSDKs = firebaseApp => {
  return Promise.all([
    preloadFirestore(firebaseApp),
    preloadDatabase(firebaseApp),
    preloadStorage(firebaseApp),
    preloadAuth(firebaseApp)
  ])
}

const preloadData = async firebaseApp => {
  const user = await preloadUser(firebaseApp)

  if (user) {
    preloadFirestoreDoc(
      firestore => firestore.doc('count/counter'),
      firebaseApp
    )
  }
}
const FirebaseAppProviderWithNoSSR = dynamic(
  () => import('reactfire').then(m => m.FirebaseAppProvider),
  { ssr: false }
)

const config = {
  apiKey: 'AIzaSyAFXmau0NssOsjWlG_nuT0G1G8HETQdmUY',
  authDomain: 'personal-a9a42.firebaseapp.com',
  databaseURL: 'https://personal-a9a42.firebaseio.com',
  projectId: 'personal-a9a42',
  storageBucket: 'personal-a9a42.appspot.com',
  messagingSenderId: '216130129438',
  appId: '1:216130129438:web:3883a24b0a041bd056680f',
  measurementId: 'G-145154VRG5'
}

function FirebasePreload({ children }) {
  const firebaseApp = useFirebaseApp()

  // Kick off fetches for SDKs and data that
  // we know our components will eventually need.
  //
  // This is OPTIONAL but encouraged as part of the render-as-you-fetch pattern
  // https://reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense
  preloadSDKs(firebaseApp).then(preloadData(firebaseApp))

  return children
}

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <StrictMode>
        <FirebaseAppProviderWithNoSSR firebaseConfig={config} initPerformance>
          <FirebasePreload>
            <Component {...pageProps} />
          </FirebasePreload>
        </FirebaseAppProviderWithNoSSR>
      </StrictMode>
    )
  }
}
