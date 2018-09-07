import Constants from './Constants'

const calculateClickScore = (stats, store, getPositiveHelperOutput, towerPurchased, upgradePurchased) => {
  let base = 1

  if (upgradePurchased(Constants.UPGRADES.HelpingHand.name, store)) {
    base += Constants.UPGRADES.HelpingHand.power
  }

  if (upgradePurchased(Constants.UPGRADES.HelpingHandsier.name, store)) {
    base += Constants.UPGRADES.HelpingHandsier.power
  }

  if (upgradePurchased(Constants.UPGRADES.HelpingHandsiest.name, store)) {
    base += Constants.UPGRADES.HelpingHandsiest.power
  }
  
  if (towerPurchased(Constants.TOWERS.Click.name, store)) {
    base += stats.clicks * Constants.TOWERS.Click.power.mouse
    base += getClickTowerBonus(stats, store, getPositiveHelperOutput)
  }

  if (upgradePurchased(Constants.UPGRADES.ClickEfficiency, store)) {
    base *= 2
  }

  return base
};

const getClickTowerBonus = (stats, store, getPositiveHelperOutput) => {
  return getPositiveHelperOutput(store, stats) * Constants.TOWERS.Click.power.helper
};

export default {
  calculateClickScore: calculateClickScore
};