import Constants from '../Constants'
import { baseTooltip, buyable, preReq } from './store-commons'

const tower = (
  name = 'Tower',
  description = 'A tower',
  price = 1,
  preReqs = null) =>
({
  ...buyable(name, description, price, Constants.PRICE_GROWTH.UPGRADE, Constants.CURRENCY.BLOCK.BLUE, false, false),
  preReqs: preReqs,
  type: 'tower'
})

const towers = {
  'Click Tower': {
    ...tower('Click Tower', 'Increases mouse power by 5% of clicks and 1% of helper power', 1000, [
      preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
    ]),
    getTooltip: baseTooltip
  },
  'Cost Tower': {
    ...tower('Cost Tower', 'Reduces score costs by 10%', 5000, [
      preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
    ]),
    getTooltip: baseTooltip
  },
  'Power Tower':{
    ...tower('Power Tower', 'Increases helper power', 2500, [
      preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
    ]),
    getTooltip: baseTooltip
  },
  'Toxicity Tower': {
    ...tower('Toxicity Tower', 'Reduces toxicity production', 5000, [
      preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
    ]),
    getTooltip: baseTooltip
  }
}

export default towers