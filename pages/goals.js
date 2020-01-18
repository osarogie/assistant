import React, { useState, SuspenseList, useTransition } from 'react'
import {
  AuthCheck,
  SuspenseWithPerf,
  useFirestoreCollectionData,
  useFirestore
} from 'reactfire'
import { PageContainer } from '../src/components/PageContainer'
import { AddButton } from '../src/components/AddButton'
import { Collapse } from 'antd'
const { Panel } = Collapse

const NewEntry = ({ saveAnimal }) => {
  const [text, setText] = useState('')
  const [disabled, setDisabled] = useState(false)

  const onSave = () => {
    setDisabled(true)
    saveAnimal(text).then(() => {
      setText('')
      setDisabled(false)
    })
  }

  return (
    // <>
    //   <input
    //     value={text}
    //     disabled={disabled}
    //     placeholder="Iguana"
    //     onChange={({ target }) => setText(target.value)}
    //   />
    //   <button onClick={onSave} disabled={disabled || text.length < 3}>
    //     Add new goal
    //   </button>
    // </>

    <AddButton placeholder="Add new goal" onEnter={onSave}></AddButton>
  )
}

const List = ({ query, removeEntry }) => {
  const subs = useFirestoreCollectionData(query, { idField: 'id' })
  return (
    <>
      <Collapse bordered={false} defaultActiveKey={['1']}>
        {subs.map(sub => (
          <Panel header={sub.commonName} key={sub.id}>
            {sub.commonName}{' '}
            <button onClick={() => removeEntry(sub.id)}>X</button>
          </Panel>
        ))}
      </Collapse>
    </>
  )
}

const FavoriteSubs = props => {
  const firestore = useFirestore()
  const baseRef = firestore().collection('goals')
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
      <React.Suspense fallback="loading...">
        <List query={query} removeEntry={removeEntry} />
      </React.Suspense>
    </>
  )
}

export default function() {
  return (
    <PageContainer>
      <SuspenseWithPerf fallback="loading..." traceId="firestore-demo-root">
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
