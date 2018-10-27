import React from 'react'
import { asSequence } from 'sequency'
import Buyable from './Buyable'

const getMapBuyable = (fade, onPurchase) => {
  return buyable => (
    <Buyable 
      key={buyable.id}
      buyable={buyable.buyable}
      fade={fade} 
      id={buyable.id}
      name={buyable.name}
      onPurchase={onPurchase}
      tooltip={buyable.tooltip}
      type={buyable.type}/>
  )
}

const idMap = (index, buyable) => ({
  ...buyable,
  id: index
})

const isBuyable = b => b.buyable
const isOneTimeBuyable = b => (b.buyable || (!b.buyable && b.purchased > 0))

const mapElements = (storeSection, mapBuyable, filter = null) => {
  let elements = asSequence(Object.values(storeSection))
  if (filter !== null) {
    elements = elements.filter(filter)
  }

  return elements.mapIndexed(idMap)
                 .map(mapBuyable)
                 .toArray()
}

export {
  idMap,
  getMapBuyable,
  isBuyable,
  isOneTimeBuyable,
  mapElements
}