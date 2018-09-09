import React from 'react'
import Buyable from '../Buyable'

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

const idMap = (buyable, index) => ({
  ...buyable,
  id: index
})

const isBuyable = b => b.buyable
const isOneTimeBuyable = b => (b.buyable || (!b.buyable && b.purchased > 0))

export {
  idMap,
  getMapBuyable,
  isBuyable,
  isOneTimeBuyable
}