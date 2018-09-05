import Constants from '../Constants'
import { baseTooltip, buyable, preReq } from './store-commons'

const special = (
  name = 'Special',
  description = 'A special',
  price = 1,
  priceGrowth = Constants.PRICE_GROWTH.SPECIAL,
  preReqs = null) =>
({
  ...buyable(name, description, price, priceGrowth, Constants.CURRENCY.BLOCK.GREEN, false, true),
  preReqs: preReqs,
  type: 'special'
})

const specials = {
  'Better Building': {
    ...special('Better Building', 'Speeds block production', 200, 1.3, [
      preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
    ]),
    currency: Constants.CURRENCY.BLOCK.BLUE,
    getTooltip: baseTooltip
  },
  'Blue Block': {
    ...special('Blue Block', 'A blue block', 5, Constants.PRICE_GROWTH.SPECIAL, [
      preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
    ]),
    getTooltip: baseTooltip
  },
  'Green Block': {
    ...special('Green Block', 'A green block', 5, Constants.PRICE_GROWTH.SPECIAL, [
      preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
    ]),
    currency: Constants.CURRENCY.BLOCK.BLUE,
    getTooltip: baseTooltip
  },
  'Tamer': {
    ...special('Tamer', 'Consumers require less score', 150, Constants.PRICE_GROWTH.SPECIAL, [
      preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
    ]),
    getTooltip: baseTooltip
  },
  'Toxic Capacity': {
    ...special('Toxic Capacity', 'Increases maximum toxicity', 300, Constants.PRICE_GROWTH.SPECIAL, [
      preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
    ]),
    getTooltip: baseTooltip
  },
  'Toxicity Recycling': {
    ...special('Toxicity Recycling', 'Removes some toxicity', 50, Constants.PRICE_GROWTH.SPECIAL, [
      preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
    ]),
    getTooltip: baseTooltip
  }
}

export default specials