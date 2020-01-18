import React from 'react'
import Search from 'antd/lib/input/Search'

export function AddButton({ placeholder = '', onEnter }) {
  return (
    <Search
      placeholder={placeholder}
      enterButton="Done"
      size="large"
      onSearch={onEnter}
    />
  )
}
