import Constants from './Constants'

const calculateClickScore = (stats, store, towerPurchased, upgradePurchased) => {
  let base = 1

  if (upgradePurchased('Helping Hand', store)) {
    base += Constants.POWER.HELPING_HAND
  }

  if (upgradePurchased('Helping Handsier', store)) {
    base += Constants.POWER.HELPING_HANDSIER
  }

  if (upgradePurchased('Helping Handsiest', store)) {
    base += Constants.POWER.HELPING_HANDSIEST
  }
  
  if (towerPurchased('Click Tower', store)) {
    base += stats.clicks * Constants.CLICK_TOWER.CLICK_RATE
    base += getClickTowerBonus(stats, store)
  }

  if (upgradePurchased('Click Efficiency', store)) {
    base *= 2
  }

  return base
};

const getClickTowerBonus = (stats, store, getPositiveHelperOutput) => {
  return getPositiveHelperOutput(store, stats) * Constants.CLICK_TOWER.HELPER_RATE
};

export default calculateClickScore;