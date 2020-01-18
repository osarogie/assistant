import React, { useState, SuspenseList, useTransition } from 'react'
import {
  AuthCheck,
  SuspenseWithPerf,
  useFirestoreCollectionData,
  useFirestore
} from 'reactfire'
import { PageContainer } from '../src/components/PageContainer'
import { Button } from 'antd'
import Search from 'antd/lib/input/Search'
import { Loader } from '../src/components/Loader'

const NewEntry = ({ saveAnimal }) => {
  const [text, setText] = useState('')
  const [disabled, setDisabled] = useState(false)

  const onSave = value => {
    if (!value) return
    setDisabled(true)
    saveAnimal(text).then(() => {
      setText('')
      setDisabled(false)
    })
  }

  return (
    <>
      <Search
        placeholder="Add a bill"
        enterButton="Done"
        size="large"
        onSearch={onSave}
      />
    </>
  )
}

const List = ({ query, removeEntry }) => {
  const subs = useFirestoreCollectionData(query, { idField: 'id' })
  return (
    <ul>
      {subs.map(sub => (
        <li key={sub.id}>
          {sub.commonName}{' '}
          <Button type="danger" onClick={() => removeEntry(sub.id)}>
            X
          </Button>
        </li>
      ))}
    </ul>
  )
}

const FavoriteSubs = props => {
  const firestore = useFirestore()
  const baseRef = firestore().collection('bills')
  const [isAscending, setIsAscending] = useState(true)
  const query = baseRef.orderBy('commonName', isAscending ? 'asc' : 'desc')
  const [startTransition, isPending] = useTransition({
    timeoutMs: 1000
  })

  const toggleSort = () => {
    startTransition(() => {
      setIsAscending(!isAscending)
    })
  }

  const addNewEntry = commonName => baseRef.add({ commonName })

  const removeEntry = id => baseRef.doc(id).delete()

  return (
    <>
      <NewEntry saveAnimal={addNewEntry} />
      <br />
      <button onClick={toggleSort} disabled={isPending}>
        Sort {isAscending ? '^' : 'v'}
      </button>
      <React.Suspense fallback={<Loader />}>
        <List query={query} removeEntry={removeEntry} />
      </React.Suspense>
    </>
  )
}

export default function() {
  return (
    <PageContainer>
      <SuspenseWithPerf fallback={<Loader />} traceId="firestore-demo-root">
        <AuthCheck fallback="sign in to use Firestore">
          <SuspenseList revealOrder="together">
            <SuspenseWithPerf
              fallback="connecting to Firestore..."
              traceId="firestore-demo-collection"
            >
              <FavoriteSubs />
            </SuspenseWithPerf>
          </SuspenseList>
        </AuthCheck>
      </SuspenseWithPerf>
    </PageContainer>
  )
}
