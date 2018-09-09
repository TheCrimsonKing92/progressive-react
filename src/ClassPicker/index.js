import React from 'react'
import './ClassPicker.css'
import ReactTooltip from 'react-tooltip'

const ClassPicker = ({classes, onClassClick}) => {
  const mapClass = (aClass, index) =>(
    <div 
      data-tip
      data-for={'classSelector ' + index}
      className={`buyable ${aClass.name.toLowerCase()}`}
      key={index}
      onClick={() => onClassClick(aClass.name)}>
        <ReactTooltip getContent={[() => aClass.description, 1000]} id={'classSelector ' + index} html={true}/>
      </div>      
  )
  return (
    <div className={'ClassPicker'}>
      <p>Choose a class to begin playing</p>
      { classes.map(mapClass) }
    </div>
  )
}

export default ClassPicker