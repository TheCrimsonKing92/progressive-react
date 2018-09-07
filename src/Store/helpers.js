import Constants from '../Constants.js'
import { buyable } from './store-commons'

const baseHelperTooltip = function(abbreviate, isClass) {
  const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
  const title = `${this.name} - ${this.purchased}`
  
  return `${title}</br>${this.description}</br>${costPhrase}</br>${this.sps} score per second`
}

const helper = (
  name,
  description,
  price,
  power,
  formula,
  tooltip) => 
({
  ...buyable(name || 'Helper', description || 'A helper', price || 1, Constants.PRICE_GROWTH.HELPER, Constants.CURRENCY.SCORE, true, true),
  power: power || 1,
  type: Constants.BUYABLE_TYPE.HELPER,
  // Using a lambda for this breaks the game
  formula: formula || function() { return this.power * this.purchased },
  getTooltip: tooltip || baseHelperTooltip
})

const helpers = {
  [Constants.HELPERS.AutoClicker.name]:
  helper(
    Constants.HELPERS.AutoClicker.name, 
    Constants.HELPERS.AutoClicker.description,
    Constants.HELPERS.AutoClicker.price,
    Constants.HELPERS.AutoClicker.power,
    function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      let base = this.power

      if (towerPurchased('Power Tower')) {
        base += Math.max(Math.floor(base * 1.1), 1)
      }

      const purchased = this.purchased

      if (isClass(Constants.CLASSES.MASTER)) {
        base++
      }
      if (upgradePurchased(Constants.UPGRADES.HelpingHand.name)) {
        base += Constants.UPGRADES.HelpingHand.power
      }

      if (upgradePurchased(Constants.UPGRADES.HelpingHandsier.name)) {
        base += Constants.UPGRADES.HelpingHandsier.power
      }

      if (upgradePurchased(Constants.UPGRADES.HelpingHandsiest.name)) {
        base += Constants.UPGRADES.HelpingHandsiest.power
      }

      let total = base * purchased

      if (magic.isToxic) {
        total *= 0.5
      } else if (magic.isHalfToxic) {
        total *= 0.9
      }

      if (upgradePurchased(Constants.UPGRADES.ClickEfficiency.name)) {
        total *= Constants.UPGRADES.ClickEfficiency.power
      }

      if (upgradePurchased(Constants.UPGRADES.AudibleMotivation.name)) {
        const audibleBase = 1.00
        const factor = Constants.UPGRADES.AudibleMotivation.power.AutoClicker * getHelper(Constants.HELPERS.Djinn.name).purchased

        total *= (audibleBase + factor)
      }

      return Math.floor(total)
  }),
  [Constants.HELPERS.Hammer.name]:
  helper(
    Constants.HELPERS.Hammer.name,
    Constants.HELPERS.Hammer.description,
    Constants.HELPERS.Hammer.price,
    Constants.HELPERS.Hammer.power,
    function (getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      let base = this.power

      if (towerPurchased('Power Tower')) {
        base += Math.max(Math.floor(base * 1.1), 1)
      }
      
      const purchased = this.purchased
      if (upgradePurchased(Constants.UPGRADES.AriaHammera.name)) {
        base += Math.floor(purchased / 15)
      }
      if (upgradePurchased('Heavier Hammers')) {
        base *= 2
      }

      let total = base * purchased
      
      if (magic.isToxic) {
        total *= 0.5
      } else if (magic.isHalfToxic) {
        total *= 0.9
      }

      return Math.floor(total)
  }),
  [Constants.HELPERS.Robot.name]:
  helper(
    Constants.HELPERS.Robot.name,
    Constants.HELPERS.Robot.description,
    Constants.HELPERS.Robot.price,
    Constants.HELPERS.Robot.power,
    function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      let base = this.power

      for (const firmware in Constants.FIRMWARES) {
        if (upgradePurchased(firmware)) {
          base += (this.power * Constants.FIRMWARES[firmware])
        }
      }
      
      if (towerPurchased('Power Tower')) {
        base += Math.max(Math.floor(base * 1.1), 1)
      }
      
      const purchased = this.purchased
      let total = base * purchased      

      if (magic.isToxic) {
        total *= 0.5
      } else if (magic.isHalfToxic) {
        total *= 0.9
      }
      
      if (upgradePurchased(Constants.UPGRADES.CyberneticSynergy.name)) {
        const power = isClass(Constants.CLASSES.MECHANIC) ? Constants.UPGRADES.CyberneticSynergy.mechanicPower : 
                                                            Constants.UPGRADES.CyberneticSynergy.power;
        const bound = Math.min(purchased, getHelper(Constants.HELPERS.Hammer.name).purchased)
        total += (power * bound)
      }

      return Math.floor(total)
  }),
  [Constants.HELPERS.Airplane.name]:
  helper(
    Constants.HELPERS.Airplane.name,
    Constants.HELPERS.Airplane.description,
    Constants.HELPERS.Airplane.price,
    Constants.HELPERS.Airplane.power,
    function (getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      let base = this.power      

      if (towerPurchased('Power Tower')) {
        base += Math.max(Math.floor(base * 1.1), 1)
      }
      
      const purchased = this.purchased
      let total = base * purchased      

      if (magic.isToxic) {
        total *= 0.5
      } else if (magic.isHalfToxic) {
        total *= 0.9
      }
      
      if (upgradePurchased(Constants.UPGRADES.ExtendedCargo.name)) {
        total *= Constants.UPGRADES.ExtendedCargo.power
      }

      if (upgradePurchased(Constants.UPGRADES.BuddySystem.name)) {
        total *= Constants.UPGRADES.BuddySystem.power
      }

      if (upgradePurchased('Fleet Beacon')) {
        if (purchased < 100) {
          total *= 2.5
        } else {
          total *= 3.5
        }
      }

      return Math.floor(total)
    }),
    [Constants.HELPERS.Cloner.name]:
    helper(
      Constants.HELPERS.Cloner.name,
      Constants.HELPERS.Cloner.description,
      Constants.HELPERS.Cloner.price,
      Constants.HELPERS.Cloner.power,
      function (getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
        let base = this.power      

        if (towerPurchased('Power Tower')) {
          base += Math.max(Math.floor(base * 1.1), 1)
        }
        
        const purchased = this.purchased
        if (upgradePurchased(Constants.UPGRADES.EfficientOperations.name)) {
          base += magic.efficientOperations
        }

        let total = base * purchased      

        if (magic.isToxic) {
          total *= 0.5
        } else if (magic.isHalfToxic) {
          total *= 0.9
        }

        if (upgradePurchased(Constants.UPGRADES.ClonerOverdrive.name)) {
          total *= Constants.UPGRADES.ClonerOverdrive.power
        }

        return Math.floor(total)
  }),
  [Constants.HELPERS.Djinn.name]:
  helper(
    Constants.HELPERS.Djinn.name,
    Constants.HELPERS.Djinn.description,
    Constants.HELPERS.Djinn.price,
    Constants.HELPERS.Djinn.power,
    function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      let base = this.power      

      if (towerPurchased('Power Tower')) {
        base += Math.max(Math.floor(base * 1.1), 1)
      }
      
      const purchased = this.purchased    
      if (upgradePurchased(Constants.UPGRADES.TheAwakening.name)) {
        base *= Constants.UPGRADES.TheAwakening.power.base
      }

      let total = base * purchased      

      if (magic.isToxic) {
        total *= 0.5
      } else if (magic.isHalfToxic) {
        total *= 0.9
      }

      if (upgradePurchased(Constants.UPGRADES.TheAwakening.name)) {
        const awakeningBase = 1.00
        const factor = Constants.AWAKENING_POWER_SCALE * magic.awakening

        total *= (awakeningBase + factor)
      }
      
      if (upgradePurchased(Constants.UPGRADES.AudibleMotivation.name)) {
        const audibleBase = 1.00
        const factor = Constants.UPGRADES.AudibleMotivation.power.Djinn * getHelper(Constants.HELPERS.AutoClicker.name).purchased

        total *= (audibleBase + factor)
      }

      return Math.floor(total)
  }),
  [Constants.HELPERS.Consumer.name]: {
    ...helper(
      Constants.HELPERS.Consumer.name,
      Constants.HELPERS.Consumer.description,
      Constants.HELPERS.Consumer.price,
      Constants.HELPERS.Consumer.power,
      function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
        const initial = this.power * Math.pow(1.5, this.purchased - 1)
        const tamers = getSpecial(Constants.SPECIALS.Tamer.name).purchased

        if (tamers === 0) return Math.ceil(initial)  
        return Math.ceil(initial * Math.pow(0.95, tamers))
      },
      function(abbreviate, getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
        const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
        const title = `${this.name} - ${this.purchased}`
        
        const base = this.buyable ? `${title}</br>${this.description}</br>${costPhrase}` : 
                                    `${title}</br>${this.description}`
        const withSps = `${base}</br>${this.sps} score per second`

        const next = `${abbreviate(this.nextFormula(getHelper, 
                                                    getSpecial, 
                                                    isClass, 
                                                    towerPurchased, 
                                                    upgradePurchased, 
                                                    magic))} score per second next`
    
        return `${withSps}</br>${next}`
    }),
    toxicity: 2,
    nextFormula: function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      const initial = this.power * Math.pow(1.5, this.purchased)
      const tamers = getSpecial(Constants.SPECIALS.Tamer.name).purchased

      if (tamers === 0) return Math.ceil(initial)
      return Math.ceil(initial * Math.pow(0.95, tamers))
    },
    toxicFormula: function(towerPurchased) {
      const base = this.toxicity * this.purchased

      if (!towerPurchased('Toxicity Tower')) return base

      return Math.floor(base * 0.9)
    }
  },
  [Constants.HELPERS.GarbageTruck.name]: {
    ...helper(
      Constants.HELPERS.GarbageTruck.name,
      Constants.HELPERS.GarbageTruck.description,
      Constants.HELPERS.GarbageTruck.price,
      Constants.HELPERS.GarbageTruck.power
    ),
    toxicity: -1,
    toxicFormula: function() {
      return Math.ceil(this.toxicity * this.purchased)
    }
  }
}

export default helpers