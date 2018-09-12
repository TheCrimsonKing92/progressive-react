import Constants from '../Constants'

const baseTooltip = function(abbreviate, isClass) {
  const title = !this.multiple ? this.name : `${this.name} - ${this.purchased}`
  const base = `${title}</br>${this.description}`
  if (!this.buyable) return base
  const currency = this.currency !== Constants.CURRENCY.SCORE ? this.currency.replace('-', ' ').concat('s') : this.currency
  return `${base}</br>Costs ${abbreviate(this.currentPrice)} ${currency}`
}

const buyable = (
  name = 'Buyable',
  description = 'A buyable',
  price = 1,
  priceGrowth = Constants.PRICE_GROWTH.HELPER,
  currency = Constants.CURRENCY.SCORE,
  buyable = false,
  multiple = false) =>
({
  name: name,
  description: description,
  currentPrice: price,
  price: price,
  priceGrowth: priceGrowth,
  currency: currency,
  buyable: buyable,
  purchased: 0,
  multiple: multiple
})

const preReq = (
  type,
  target,
  value) =>
({
  type: type,
  target: target,
  value: value
})

const consumerPurchased = [
  preReq(
    Constants.PREREQ.HELPER.PURCHASED,
    Constants.HELPERS.Consumer.name
  )
]

export { baseTooltip, buyable, consumerPurchased, preReq }
export default {
  baseTooltip: baseTooltip,
  buyable: buyable,
  consumerPurchased: consumerPurchased,
  preReq: preReq
}