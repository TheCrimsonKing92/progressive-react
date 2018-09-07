import Constants from '../Constants'
import { baseTooltip, buyable, consumerPurchased } from './store-commons'

const special = (
  name = 'Special',
  description = 'A special',
  price = 1,
  priceGrowth = Constants.PRICE_GROWTH.SPECIAL,
  preReqs = consumerPurchased,
  currency = Constants.CURRENCY.BLOCK.GREEN,
  tooltip = baseTooltip) =>
({
  ...buyable(name, description, price, priceGrowth, currency, false, true),
  preReqs: preReqs,
  type: Constants.BUYABLE_TYPE.SPECIAL,
  getTooltip: tooltip
})

const specials = Object.values(Constants.SPECIALS)
                       .reduce((acc, curr) => {
                        const label = curr.name
                        switch (label) {
                          case Constants.SPECIALS.BetterBuilding.name:
                            acc[label] = special(
                              label,
                              curr.description,
                              curr.price,
                              curr.priceGrowth,
                              undefined,
                              Constants.CURRENCY.BLOCK.BLUE
                            )
                            break
                          case Constants.SPECIALS.GreenBlock.name:
                              acc[label] = special(
                                label,
                                curr.description,
                                curr.price,
                                undefined,
                                undefined,
                                Constants.CURRENCY.BLOCK.BLUE
                              )
                              break
                          case Constants.SPECIALS.Tamer.name:
                              acc[label] = special(
                                label,
                                curr.description,
                                curr.price,
                                undefined,
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
                                curr.price
                              )
                              break
                        }
                        return acc
                       }, {})

export default specials