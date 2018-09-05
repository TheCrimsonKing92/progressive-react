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
      if (upgradePurchased('Helping Hand')) {
        base++
      }

      if (upgradePurchased('Helping Handsier')) {
        base += 2
      }

      if (upgradePurchased('Helping Handsiest')) {
        base += 6
      }

      let total = base * purchased

      if (magic.isToxic) {
        total *= 0.5
      } else if (magic.isHalfToxic) {
        total *= 0.9
      }

      if (upgradePurchased('Click Efficiency')) {
        total *= 2
      }

      if (upgradePurchased('Audible Motivation')) {
        const audibleBase = 1.00
        const factor = .01 * getHelper('Djinn').purchased

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
      if (upgradePurchased('Aria Hammera')) {
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
      
      if (upgradePurchased('Cybernetic Synergy')) {
        const power = isClass(Constants.CLASSES.MECHANIC) ? 28 : 14;
        const bound = Math.min(purchased, getHelper('Hammer').purchased)
        total += (power * bound)
      }

      return Math.floor(total)
  }),
  'Airplane': helper('Airplane', 'An allied airplane to drop score en masse', 20000, 40, function (getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
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
    
    if (upgradePurchased('Extended Cargo')) {
      total *= 1.25
    }

    if (upgradePurchased('Buddy System')) {
      total *= 2
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
  'Cloner': helper('Cloner', 'Creates score by cloning parts of the button', 100000, 100, function (getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
    let base = this.power      

    if (towerPurchased('Power Tower')) {
      base += Math.max(Math.floor(base * 1.1), 1)
    }
    
    const purchased = this.purchased
    if (upgradePurchased('Efficient Operations')) {
      base += magic.efficientOperations
    }

    let total = base * purchased      

    if (magic.isToxic) {
      total *= 0.5
    } else if (magic.isHalfToxic) {
      total *= 0.9
    }

    if (upgradePurchased('Cloner Overdrive')) {
      total *= 1.4
    }

    return Math.floor(total)
  }),
  'Djinn': helper('Djinn', 'An ancient fire spirit mystically connected to the button', 3500000, 350, function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
    let base = this.power      

    if (towerPurchased('Power Tower')) {
      base += Math.max(Math.floor(base * 1.1), 1)
    }
    
    const purchased = this.purchased    
    if (upgradePurchased('The Awakening')) {
      base *= 0.75
    }

    let total = base * purchased      

    if (magic.isToxic) {
      total *= 0.5
    } else if (magic.isHalfToxic) {
      total *= 0.9
    }

    if (upgradePurchased('The Awakening')) {
      const awakeningBase = 1.00
      const factor = Constants.AWAKENING_POWER_SCALE * magic.awakening

      total *= (awakeningBase + factor)
    }
    
    if (upgradePurchased('Audible Motivation')) {
      const audibleBase = 1.00
      const factor = .02 * getHelper('AutoClicker').purchased

      total *= (audibleBase + factor)
    }

    return Math.floor(total)
  }),
  'Consumer': {
    ...helper('Consumer', 'An anti-helper that consumes score to produce blocks', 5000, -5, function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      const initial = this.power * Math.pow(1.5, this.purchased - 1)
      const tamers = getSpecial('Tamer').purchased

      if (tamers === 0) return Math.ceil(initial)  
      return Math.ceil(initial * Math.pow(0.95, tamers))
    }, function(abbreviate, getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const title = `${this.name} - ${this.purchased}`
      
      const base = this.buyable ? `${title}</br>${this.description}</br>${costPhrase}` : `${title}</br>${this.description}`
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
      const tamers = getSpecial('Tamer').purchased

      if (tamers === 0) return Math.ceil(initial)
      return Math.ceil(initial * Math.pow(0.95, tamers))
    },
    toxicFormula: function(towerPurchased) {
      const base = this.toxicity * this.purchased

      if (!towerPurchased('Toxicity Tower')) return base

      return Math.floor(base * 0.9)
    }
  },
  'Garbage Truck': {
    ...helper('Garbage Truck', 'An anti-consumer that takes toxicity to The Dump', 15000, -50, function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      return this.power * this.purchased
    }),
    toxicity: -1,
    toxicFormula: function(towerPurchased) {
      return Math.ceil(this.toxicity * this.purchased)
    }
  }
}

export default helpers