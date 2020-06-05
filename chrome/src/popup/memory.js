import React from 'react'
import {Bar, Tip, Title} from './styled'

const toGiga = (byte) => (byte / (1024 * 1024 * 1024)).toFixed(2);

const MemoryComponent = ({ capacity, availableCapacity }) => {
  const memoryStyle = {width: `${100 * (1 - availableCapacity / capacity)}%`}
  return (
    <div>
      <Title>Memory</Title>
      <Tip>
        Available: {toGiga(availableCapacity)}GB/{toGiga(capacity)}GB
      </Tip>
      <Bar
        borderColor="#8fd8d4"
        usages={[
          {
            color: '#198e88',
            ratio: 1 - availableCapacity / capacity,
          },
        ]}
      />
    </div>
  )
}

export default MemoryComponent
