import { SuspenseWithPerf, useUser, useAuth } from 'reactfire'
import { PageHeader, Button } from 'antd'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { Loader } from '../Loader'

const signOut = auth =>
  auth()
    .signOut()
    .then(() => console.log('signed out'))

function Content() {
  const user = useUser()
  const auth = useAuth()

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  }

  if (!user)
    return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()} />

  return (
    <PageHeader
      title={user?.displayName}
      style={{
        border: '1px solid rgb(235, 237, 240)'
      }}
      extra={[
        <Button key="1" type="primary" onClick={() => signOut(auth)}>
          Log out
        </Button>
      ]}
      avatar={{
        src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4'
      }}
    ></PageHeader>
  )
}

export function UserControls() {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<Loader />}>
      <Content />
    </SuspenseWithPerf>
  )
}
