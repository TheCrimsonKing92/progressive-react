import Constants from '../Constants'
import { baseTooltip, buyable, consumerPurchased } from './store-commons'

const tower = (
  name = 'Tower',
  description = 'A tower',
  price = 1,
  preReqs = consumerPurchased,
  tooltip = baseTooltip) =>
({
  ...buyable(
    name,
    description,
    price,
    Constants.PRICE_GROWTH.UPGRADE,
    Constants.CURRENCY.BLOCK.BLUE,
    false,
    false
  ),
  preReqs: preReqs,
  type: Constants.BUYABLE_TYPE.TOWER,
  getTooltip: tooltip
})

const towers = Object.values(Constants.TOWERS)
                     .reduce((acc, curr) => {
                       acc[curr.name] = tower(
                         curr.name,
                         curr.description,
                         curr.price
                       );
                       return acc;
                     }, {});

export default towers