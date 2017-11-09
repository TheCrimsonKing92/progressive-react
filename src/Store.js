import './Store.css'
import Constants from './Constants'

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
  price: price,
  priceGrowth: priceGrowth,
  currency: currency,
  buyable: buyable,
  purchased: 0,
  multiple: multiple
})

const helper = (
  name = 'Helper',
  description = 'A helper',
  price = 1,
  power = 1,
  formula) => 
({
  ...buyable(name, description, price, Constants.PRICE_GROWTH.HELPER, Constants.CURRENCY.SCORE, true, true),
  power: power,
  type: 'helper',
  formula: formula || function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) { return this.power * this.purchased }
})

const helpers = {
  'AutoClicker': {
    ...helper('AutoClicker', 'Weakly clicks the button for you', 100),
    formula: function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
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

      if (magic.isHalfToxic) {
        total *= 0.9
      } else if (magic.isToxic) {
        total *= 0.5
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
    },
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const title = `${this.name} - ${this.purchased}`
      
      const base = this.buyable ? `${title}</br>${this.description}</br>${costPhrase}` : `${title}</br>${this.description}`
      return `${base}</br>${this.sps} score per second`
    }
  },
  'Hammer': {
    ...helper('Hammer', 'Earns score by smashing the button', 500, 5),
    formula: function (getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
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
      
      if (magic.isHalfToxic) {
        total *= 0.9
      } else if (magic.isToxic) {
        total *= 0.5
      }

      if (upgradePurchased('Cybernetic Synergy')) {
        let power = 5
        if (isClass(Constants.CLASSES.MECHANIC)) power *= 2
        const bound = Math.min(purchased, getHelper('Robot').purchased)
        total += (power * bound)
      }

      return Math.floor(total)
    },
    getTooltip: function(abbreviate, isClass) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const title = `${this.name} - ${this.purchased}`
      
      const base = this.buyable ? `${title}</br>${this.description}</br>${costPhrase}` : `${title}</br>${this.description}`
      return `${base}</br>${this.sps} score per second`
    }
  },
  'Robot': {
    ...helper('Robot', 'An AI optimizing score production routines', 1500, 14),
    formula: function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      let base = this.power
      
      if (towerPurchased('Power Tower')) {
        base += Math.max(Math.floor(base * 1.1), 1)
      }
      
      const purchased = this.purchased
      let total = base * purchased      

      if (magic.isHalfToxic) {
        total *= 0.9
      } else if (magic.isToxic) {
        total *= 0.5
      }
      
      if (upgradePurchased('Cybernetic Synergy')) {
        let power = 9
        if (isClass(Constants.CLASSES.MECHANIC)) power *= 2
        const bound = Math.min(purchased, getHelper('Hammer').purchased)
        total += (power * bound)
      }

      return Math.floor(total)
    },
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const title = `${this.name} - ${this.purchased}`
      
      const base = this.buyable ? `${title}</br>${this.description}</br>${costPhrase}` : `${title}</br>${this.description}`
      return `${base}</br>${this.sps} score per second`
    }
  },
  'Airplane': {
    ...helper('Airplane', 'An allied airplane to drop score en masse', 20000, 40),
    formula: function (getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      let base = this.power      

      if (towerPurchased('Power Tower')) {
        base += Math.max(Math.floor(base * 1.1), 1)
      }
      
      const purchased = this.purchased
      let total = base * purchased      

      if (magic.isHalfToxic) {
        total *= 0.9
      } else if (magic.isToxic) {
        total *= 0.5
      }
      
      if (upgradePurchased('Extended Cargo')) {
        total *= 1.25
      }

      if (upgradePurchased('Buddy System')) {
        total *= 2
      }

      if (upgradePurchased('Fleet Beacon')) {
        if (purchased < 100) {
          total *= 2
        } else {
          total *= 3
        }
      }

      return Math.floor(total)
    },
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const title = `${this.name} - ${this.purchased}`
      
      const base = this.buyable ? `${title}</br>${this.description}</br>${costPhrase}` : `${title}</br>${this.description}`
      return `${base}</br>${this.sps} score per second`
    }
  },
  'Cloner': {
    ...helper('Cloner', 'Creates score by cloning parts of the button', 100000, 100),
    formula: function (getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      let base = this.power      

      if (towerPurchased('Power Tower')) {
        base += Math.max(Math.floor(base * 1.1), 1)
      }
      
      const purchased = this.purchased
      if (upgradePurchased('Efficient Operations')) {
        base += magic.efficientOperations
      }

      let total = base * purchased      

      if (magic.isHalfToxic) {
        total *= 0.9
      } else if (magic.isToxic) {
        total *= 0.5
      }

      if (upgradePurchased('Cloner Overdrive')) {
        total *= 1.4
      }

      return Math.floor(total)
    },
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const title = `${this.name} - ${this.purchased}`
      
      const base = this.buyable ? `${title}</br>${this.description}</br>${costPhrase}` : `${title}</br>${this.description}`
      return `${base}</br>${this.sps} score per second`
    }
  },
  'Djinn': {
    ...helper('Djinn', 'An ancient fire spirit mystically connected to the button', 3500000, 350),
    formula: function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      let base = this.power      

      if (towerPurchased('Power Tower')) {
        base += Math.max(Math.floor(base * 1.1), 1)
      }
      
      const purchased = this.purchased    
      if (upgradePurchased('The Awakening')) {
        base *= 0.75
      }

      let total = base * purchased      

      if (magic.isHalfToxic) {
        total *= 0.9
      } else if (magic.isToxic) {
        total *= 0.5
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
    },
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const title = `${this.name} - ${this.purchased}`
      
      const base = this.buyable ? `${title}</br>${this.description}</br>${costPhrase}` : `${title}</br>${this.description}`
      return `${base}</br>${this.sps} score per second`
    }
  },
  'Consumer': {
    ...helper('Consumer', 'An anti-helper that consumes score to produce blocks', 5000, -5),
    toxicity: 2,
    formula: function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      const initial = this.power * Math.pow(1.5, this.purchased - 1)
      const tamers = getSpecial('Tamer').purchased

      if (tamers === 0) return Math.ceil(initial)  
      return Math.ceil(initial * Math.pow(0.95, tamers))
    },
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
    },
    getTooltip: function(abbreviate, getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
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
    }
  },
  'Garbage Truck': {
    ...helper('Garbage Truck', 'An anti-consumer that pushes toxicity into The Dump', 15000, -50),
    toxicity: -1,
    formula: function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      return this.power * this.purchased
    },
    toxicFormula: function(towerPurchased) {
      return Math.ceil(this.toxicity * this.purchased)
    },
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const title = `${this.name} - ${this.purchased}`
      
      const base = this.buyable ? `${title}</br>${this.description}</br>${costPhrase}` : `${title}</br>${this.description}`
      return `${base}</br>${this.sps} score per second`
    }
  }
}

const preReq = (
  type,
  target,
  value) =>
({
  type: type,
  target: target,
  value: value
})

const upgrade = (
  name = 'Upgrade',
  description = 'An upgrade',
  price = 1,
  preReqs = null) => 
({
  ...buyable(name, description, price, Constants.PRICE_GROWTH.UPGRADE, Constants.CURRENCY.SCORE, preReqs === null, false),
  preReqs: preReqs,
  type: 'upgrade'
})

const upgrades = {
  'Helping Hand': {
    ...upgrade('Helping Hand', '+1 AutoClicker and mouse power', 200),
    buyable: true,
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      return this.buyable ? `${this.name}</br>${this.description}</br>${costPhrase}` : `${this.name}</br>${this.description}`
    }
  },
  'Click Efficiency': {
    ...upgrade('Click Efficiency', '+100% AutoClicker and mouse power', 1000, [
      preReq(Constants.PREREQ.CLICKS.NUMBER, null, 150),
      preReq(Constants.PREREQ.HELPER.NUMBER, 'AutoClicker', 10)
    ]),
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      return this.buyable ? `${this.name}</br>${this.description}</br>${costPhrase}` : `${this.name}</br>${this.description}`
    }
  },
  'Heavier Hammers': {
    ...upgrade('Heavier Hammers', '+100% Hammer power', 1250, [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Hammer', 5)
    ]),
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      return this.buyable ? `${this.name}</br>${this.description}</br>${costPhrase}` : `${this.name}</br>${this.description}`
    }
  },
  'Helping Handsier': {
    ...upgrade('Helping Handsier', '+2 AutoClicker and mouse power', 2500, [
      preReq(Constants.PREREQ.CLICKS.NUMBER, null, 300),
      preReq(Constants.PREREQ.UPGRADE.PURCHASED, 'Helping Hand')
    ]),
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      return this.buyable ? `${this.name}</br>${this.description}</br>${costPhrase}` : `${this.name}</br>${this.description}`
    }
  },
  'Helping Handsiest': {
    ...upgrade('Helping Handsiest', '+6 AutoClicker and mouse power', 7000, [
      preReq(Constants.PREREQ.CLICKS.NUMBER, null, 500),
      preReq(Constants.PREREQ.UPGRADE.PURCHASED, 'Helping Handsier')
    ]),
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      return this.buyable ? `${this.name}</br>${this.description}</br>${costPhrase}` : `${this.name}</br>${this.description}`
    }
  },
  'Cybernetic Synergy': {
    ...upgrade('Cybernetic Synergy', '+14 power per Hammer and Robot pair', 9000, [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Hammer', 10),
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Robot', 10)
    ]),
    getTooltip: function(abbreviate, isClass) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const description = isClass(Constants.CLASSES.MECHANIC) ? 
                            this.description.replace('+14', '+28').concat(` (+100% ${Constants.CLASSES.MECHANIC.name} bonus)`) 
                            : this.description
      return this.buyable ? `${this.name}</br>${description}</br>${costPhrase}` : `${this.name}</br>${description}`
    }
  },
  'Extended Cargo': {
    ...upgrade('Extended Cargo', '+25% Airplane power', 23000, [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Airplane', 10)
    ]),
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      return this.buyable ? `${this.name}</br>${this.description}</br>${costPhrase}` : `${this.name}</br>${this.description}`
    }
  },
  'Buddy System': {
    ...upgrade('Buddy System', '+100% Airplane power', 85000, [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Airplane', 15)
    ]),
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      return this.buyable ? `${this.name}</br>${this.description}</br>${costPhrase}` : `${this.name}</br>${this.description}`
    }
  },
  'Cloner Overdrive': {
    ...upgrade('Cloner Overdrive', '+40% Cloner power', 300000, [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Cloner', 10)
    ]),
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      return this.buyable ? `${this.name}</br>${this.description}</br>${costPhrase}` : `${this.name}</br>${this.description}`
    }
  },
  'Aria Hammera': {
    ...upgrade('Aria Hammera', '+1 Hammer power per 15 Hammers', 600000, [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Hammer', 15)
    ]),
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      return this.buyable ? `${this.name}</br>${this.description}</br>${costPhrase}` : `${this.name}</br>${this.description}`
    }
  },
  'Fleet Beacon': {
    ...upgrade('Fleet Beacon', '+100% Airplane power. +200% at 100 Airplanes', 1750000, [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Airplane', 25)
    ]),
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      return this.buyable ? `${this.name}</br>${this.description}</br>${costPhrase}` : `${this.name}</br>${this.description}`
    }
  },
  'The Awakening': {
    ...upgrade('The Awakening', 'Djinn sacrifice current power to reach full potential', 5000000, [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Djinn', 10)
    ]),
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      return this.buyable ? `${this.name}</br>${this.description}</br>${costPhrase}` : `${this.name}</br>${this.description}`
    }
  },
  'Audible Motivation': {
    ...upgrade('Audible Motivation', '+2% Djinn power per AutoClicker. +1% AutoClicker power per Djinn', 10000000, [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Djinn', 15),
      preReq(Constants.PREREQ.HELPER.NUMBER, 'AutoClicker', 15)
    ]),
    getTooltip: function(abbreviate) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      return this.buyable ? `${this.name}</br>${this.description}</br>${costPhrase}` : `${this.name}</br>${this.description}`
    }
  },
  'Efficient Operations': {
    ...upgrade('Efficient Operations', 'Each Robot has a chance to upgrade the base power of Cloners', 20000000, [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Robot', 20),
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Cloner', 20)
    ]),
    getTooltip: function(abbreviate, isClass) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const description = isClass(Constants.CLASSES.MECHANIC) ?
                            this.description.concat(` (2x ${Constants.CLASSES.MECHANIC.name} rate)`)
                            : this.description
      return this.buyable ? `${this.name}</br>${description}</br>${costPhrase}` : `${this.name}</br>${description}`
    }
  }
}

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
  'Click Tower': tower('Click Tower', 'Increases mouse power by 5% of clicks and 1% of helper power', 10000, [
    preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer'),
  ]),
  'Cost Tower': tower('Cost Tower', 'Reduces score costs by 10%', 5000, [
    preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
  ]),
  'Power Tower': tower('Power Tower', 'Increases helper power', 2500, [
    preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
  ]),
  'Toxicity Tower': tower('Toxicity Tower', 'Reduces toxicity production', 5000, [
    preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
  ])
}

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
    currency: Constants.CURRENCY.BLOCK.BLUE
  },
  'Blue Block': special('Blue Block', 'A blue block', 5, Constants.PRICE_GROWTH.SPECIAL, [
    preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
  ]),
  'Green Block': {
    ...special('Green Block', 'A green block', 5, Constants.PRICE_GROWTH.SPECIAL, [
      preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
    ]),
    currency: Constants.CURRENCY.BLOCK.BLUE
  },
  'Tamer': special('Tamer', 'Consumers require less score', 150, Constants.PRICE_GROWTH.SPECIAL, [
    preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
  ]),
  'Toxic Capacity': special('Toxic Capacity', 'Increases maximum toxicity by 5', 300, Constants.PRICE_GROWTH.SPECIAL, [
    preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
  ]),
  'Toxicity Recycling': special('Toxicity Recycling', 'Removes 10 toxicity', 50, Constants.PRICE_GROWTH.SPECIAL, [
    preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
  ])
}

export default {
  helpers: helpers,
  upgrades: upgrades,
  towers: towers,
  specials: specials
}