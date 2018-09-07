import Constants from '../Constants'
import { baseCurrentPrice, baseTooltip, buyable, consumerPurchased } from './store-commons'

const special = (
  name = 'Special',
  description = 'A special',
  currentPriceFormula = baseCurrentPrice,
  price = 1,
  priceGrowth = Constants.PRICE_GROWTH.SPECIAL,
  currency = Constants.CURRENCY.BLOCK.GREEN,
  tooltip = baseTooltip) =>
({
  ...buyable(name, description, price, priceGrowth, currency, false, true),
  preReqs: consumerPurchased,
  type: Constants.BUYABLE_TYPE.SPECIAL,
  getTooltip: tooltip,
  currentPriceFormula: currentPriceFormula
})

const currentPriceBlock = function (isClass, towerPurchased) {
  let basePrice = this.price
  let growth = this.priceGrowth

  return Math.floor(basePrice * Math.pow(growth, this.purchased))
}

const specials = Object.values(Constants.SPECIALS)
                       .reduce((acc, curr) => {
                        const label = curr.name
                        switch (label) {
                          case Constants.SPECIALS.BetterBuilding.name:
                            acc[label] = special(
                              label,
                              curr.description,
                              undefined,
                              curr.price,
                              curr.priceGrowth,
                              Constants.CURRENCY.BLOCK.BLUE
                            )
                            break
                          case Constants.SPECIALS.BlueBlock.name:
                              acc[label] = special(
                                label,
                                curr.description,
                                currentPriceBlock,
                                curr.price
                              )
                          case Constants.SPECIALS.GreenBlock.name:
                              acc[label] = special(
                                label,
                                curr.description,
                                currentPriceBlock,
                                curr.price,
                                undefined,
                                Constants.CURRENCY.BLOCK.BLUE
                              )
                              break
                          case Constants.SPECIALS.Tamer.name:
                              acc[label] = special(
                                label,
                                curr.description,
                                baseCurrentPrice,
                                curr.price,
                                undefined,
                                undefined,
                                function(abbreviate) {
                                  const title = !this.multiple ? this.name : `${this.name} - ${this.purchased}`
                                  const saved = 100 - Math.ceil(100 * Math.pow(0.95, this.purchased))
                                  const base = `${title}</br>${this.description} (${saved}% currently)`
                                  if (!this.buyable) return base
                                  const currency = this.currency.replace('-', ' ').concat('s')
                                  return `${base}</br>Costs ${abbreviate(this.currentPrice)} ${currency}`
                                }
                              )
                              break;
                          default:
                              acc[label] = special(
                                label,
                                curr.description,
                                baseCurrentPrice,
                                curr.price
                              )
                              break
                        }
                        return acc
                       }, {})

export default specials