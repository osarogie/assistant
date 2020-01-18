import React, { useState, SuspenseList, useTransition } from 'react'
import {
  AuthCheck,
  SuspenseWithPerf,
  useFirestoreCollectionData,
  useFirestore
} from 'reactfire'
import { PageContainer } from '../src/components/PageContainer'
import { List, Avatar } from 'antd'
import { Table, Divider, Tag } from 'antd'
import { Loader } from '../src/components/Loader'

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
    <>
      <input
        value={text}
        disabled={disabled}
        placeholder="Iguana"
        onChange={({ target }) => setText(target.value)}
      />
      <button onClick={onSave} disabled={disabled || text.length < 3}>
        Add new bill
      </button>
    </>
  )
}

const FirebaseList = ({ query, removeEntry }) => {
  const subs = useFirestoreCollectionData(query, { idField: 'id' })

  const columns = [
    {
      title: 'Name',
      dataIndex: 'commonName',
      key: 'name',
      render: text => text
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source'
    },
    {
      title: 'Action',
      key: 'action',
      render: ({ id }) => (
        <span>
          <a onClick={() => removeEntry(id)}>Delete</a>
        </span>
      )
    }
  ]

  return <Table columns={columns} dataSource={subs}></Table>
}

const FavoriteSubs = props => {
  const firestore = useFirestore()
  const baseRef = firestore().collection('wish')
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
        <FirebaseList query={query} removeEntry={removeEntry} />
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
