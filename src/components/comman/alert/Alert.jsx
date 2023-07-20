import React from 'react'
import './alert.css'

const Alert = ({onYes, onNo}) => {
  return (
    <div className='alert-box'>
        <h3>Are You Sure ?</h3>
        <div className='alert-btn'>
            <button onClick={onYes}>Yes</button>
            <button onClick={onNo}>No</button>
        </div>
    </div>
  )
}

export default Alert