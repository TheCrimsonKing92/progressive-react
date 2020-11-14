import './Store.css'
import Constants from './Constants'

const baseTooltip = function(abbreviate, { isClass }) {
  const title = !this.multiple ? this.name : `${this.name} - ${this.purchased}`
  const base = `${title}</br>${this.description}`
  if (!this.buyable) return base
  const currency = this.currency !== Constants.CURRENCY.SCORE ? this.currency.replace('-', ' ').concat('s') : this.currency
  return `${base}</br>Costs ${abbreviate(this.currentPrice)} ${currency}`
}

const baseHelperFormula = function ({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }) {
  let total = this.power * this.purchased        

  if (magic.isToxic) {
    total *= 0.5
  } else if (magic.isHalfToxic) {
    total *= 0.9
  }

  return total
}

const baseHelperTooltip = function(abbreviate, { getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }) {
  const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
  const title = `${this.name} - ${this.purchased}`

  const sps = this.formula({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic })
  const each = this.purchased === 0 ? 0 : abbreviate(parseFloat((sps / this.purchased).toFixed(2)))
  
  return `${title}</br>${this.description}</br>${costPhrase}</br>${this.sps} score per second (${each} each)`
}

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
  name,
  description,
  price,
  power,
  formula,
  tooltip) => 
({
  ...buyable(name || 'Helper', description || 'A helper', price || 1, Constants.PRICE_GROWTH.HELPER, Constants.CURRENCY.SCORE, true, true),
  power: power || 1,
  type: 'helper',
  formula: formula || baseHelperFormula,
  getTooltip: tooltip || baseHelperTooltip
})

const helpers = {
  'AutoClicker': helper('AutoClicker', 'Weakly clicks the button for you', 100, 1, function({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }) {
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

    if (upgradePurchased('Clicker Training')) {
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
  'Hammer': helper('Hammer', 'Earns score by smashing the button', 500, 5, function ({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }) {
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

    if (upgradePurchased('Cybernetic Synergy')) {
      let power = 5
      if (isClass(Constants.CLASSES.MECHANIC)) power *= 2
      const bound = Math.min(purchased, getHelper('Robot').purchased)
      total += (power * bound)
    }

    return Math.floor(total)
  }),
  'Robot': helper('Robot', 'An AI optimizing score production routines', 1500, 14, function({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }) {
    let base = this.power
    
    if (towerPurchased('Power Tower')) {
      base += Math.max(Math.floor(base * 1.1), 1)
    }

    if (upgradePurchased('Plastic Bodies')) {
      base *= 0.95
    } else if (upgradePurchased('Steel Bodies')) {
      base *= 1.1
    }
    
    const purchased = this.purchased
    let total = base * purchased      

    if (magic.isToxic) {
      total *= 0.5
    } else if (magic.isHalfToxic) {
      total *= 0.9
    }
    
    if (upgradePurchased('Cybernetic Synergy')) {
      let power = 9
      if (isClass(Constants.CLASSES.MECHANIC)) power *= 2
      const bound = Math.min(purchased, getHelper('Hammer').purchased)
      total += (power * bound)
    }

    return Math.floor(total)
  }),
  'Airplane': helper('Airplane', 'An allied airplane to drop score en masse', 20000, 40, function ({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }) {
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
      if (purchased < 50) {
        total *= 2
      } else if (purchased < 100) {
        total *= 3
      } else {
        total *= 4
      }
    }

    return Math.floor(total)
  }),
  'Cloner': helper('Cloner', 'Creates score by cloning parts of the button', 105000, 110, function ({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }) {
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
  'Djinn': helper('Djinn', 'An ancient fire spirit mystically connected to the button', 3500000, 350, function({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }) {
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
    ...helper('Consumer', 'An anti-helper that consumes score to produce blocks', 5000, -5, function({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }) {
      const initial = this.power * Math.pow(1.5, this.purchased - 1)
      const tamers = getSpecial('Tamer').purchased

      if (tamers === 0) return Math.ceil(initial)  
      return Math.ceil(initial * Math.pow(0.95, tamers))
    }, function(abbreviate, { getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const title = `${this.name} - ${this.purchased}`
      
      const base = this.buyable ? `${title}</br>${this.description}</br>${costPhrase}` : `${title}</br>${this.description}`
      const withSps = `${base}</br>${this.sps} score per second`

      const nextVal = this.nextFormula(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic)
      const diff = abbreviate(nextVal - this.formula({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }))

      const next = `${abbreviate(nextVal)} score per second next`
  
      const toxicity = this.toxicFormula({ towerPurchased })
      return `${withSps}</br>${next} (${diff} more)</br>${toxicity} toxicity per second`
    }),
    toxicity: 2,
    nextFormula: function(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic) {
      const initial = this.power * Math.pow(1.5, this.purchased)
      const tamers = getSpecial('Tamer').purchased

      if (tamers === 0) return Math.ceil(initial)
      return Math.ceil(initial * Math.pow(0.95, tamers))
    },
    toxicFormula: function({ towerPurchased }) {
      const base = this.toxicity * this.purchased

      if (!towerPurchased('Toxicity Tower')) return base

      return Math.floor(base * 0.9)
    }
  },
  'Garbage Truck': {
    ...helper('Garbage Truck', 'An anti-consumer that takes toxicity to The Dump', 15000, -50, 
    function ({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }) {
      let power = this.power

      if (upgradePurchased('Improved Engines')) {
        power *= 0.75
      }

      return power * this.purchased
    },
    function(abbreviate, { getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }){
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const title = `${this.name} - ${this.purchased}`
      const sps = this.formula({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic })
      const each = this.purchased === 0 ? 0 : abbreviate(parseFloat((sps / this.purchased).toFixed(2)))
      const toxicity = this.toxicFormula({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic })

      return `${title}</br>` +
             `${this.description}</br>` +
             `${costPhrase}</br>` +
             `${this.sps} score per second (${each} each)</br>` +
             `${toxicity} toxicity per second`
    }),
    toxicity: -1,
    toxicFormula: function({ getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }) {
      const power = this.toxicity - getSpecial('Sturdy Frames').purchased
      return Math.ceil(power * this.purchased)
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
  name,
  description,
  price,
  preReqs,
  tooltip) => 
({
  ...buyable(name || 'Upgrade',
             description || 'An upgrade',
             price || 1, Constants.PRICE_GROWTH.UPGRADE, Constants.CURRENCY.SCORE, preReqs === null, false),
  preReqs: preReqs || null,
  getTooltip: tooltip || baseTooltip,
  type: 'upgrade'
})

const upgrades = {
  'Helping Hand': {
    ...upgrade('Helping Hand', '+1 AutoClicker and mouse power', 200),
    buyable: true,
    getTooltip: baseTooltip
  },
  'Clicker Training': upgrade('Clicker Training', '+1 AutoClicker power', 1500, [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'AutoClicker', 5)
  ]),
  'Click Efficiency': upgrade('Click Efficiency', '+100% AutoClicker and mouse power', 1000, [
    preReq(Constants.PREREQ.CLICKS.NUMBER, null, 150),
    preReq(Constants.PREREQ.HELPER.NUMBER, 'AutoClicker', 10)
  ]),
  'Heavier Hammers': upgrade('Heavier Hammers', '+100% Hammer power', 1250, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Hammer', 5)
  ]),
  'Helping Handsier': upgrade('Helping Handsier', '+2 AutoClicker and mouse power', 2500, [
    preReq(Constants.PREREQ.CLICKS.NUMBER, null, 300),
    preReq(Constants.PREREQ.UPGRADE.PURCHASED, 'Helping Hand')
  ]),
  'Helping Handsiest': upgrade('Helping Handsiest', '+6 AutoClicker and mouse power', 7000, [
    preReq(Constants.PREREQ.CLICKS.NUMBER, null, 500),
    preReq(Constants.PREREQ.UPGRADE.PURCHASED, 'Helping Handsier')
  ]),
  'Plastic Bodies': upgrade('Plastic Bodies', '-15% Robot cost, -5% power</br>Excludes purchase of Steel Bodies', 7500, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Robot', 5),
    preReq(Constants.PREREQ.UPGRADE.UNPURCHASED, 'Steel Bodies')
  ]),
  'Steel Bodies': upgrade('Steel Bodies', '+5% Robot cost, +10% power</br>Excludes purchase of Plastic Bodies', 10000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Robot', 5),
    preReq(Constants.PREREQ.UPGRADE.UNPURCHASED, 'Plastic Bodies')
  ]),
  'Cybernetic Synergy': upgrade('Cybernetic Synergy', '+14 power per Hammer and Robot pair', 9000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Hammer', 10),
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Robot', 10)
  ], function(abbreviate, { isClass }) {
    const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
    const description = isClass(Constants.CLASSES.MECHANIC) ? 
                          this.description.replace('+14', '+28').concat(` (+100% ${Constants.CLASSES.MECHANIC.name} bonus)`) 
                          : this.description
    return this.buyable ? `${this.name}</br>${description}</br>${costPhrase}` : `${this.name}</br>${description}`
  }),
  'Extended Cargo': upgrade('Extended Cargo', '+25% Airplane power', 23000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Airplane', 10)
  ]),
  'Mass Production': upgrade('Mass Production', '-10% Airplane cost', 55000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Airplane', 15)
  ]),
  'Buddy System': upgrade('Buddy System', '+100% Airplane power', 85000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Airplane', 15)
  ]),
  'Improved Engines': upgrade('Improved Engines', '-25% Garbage Truck score cost', 90000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Garbage Truck', 5)
  ]),
  'Cloner Overdrive': upgrade('Cloner Overdrive', '+40% Cloner power', 300000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Cloner', 10)
  ]),
  'Aria Hammera': upgrade('Aria Hammera', '+1 Hammer power per 15 Hammers', 600000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Hammer', 15)
  ]),
  'Fleet Beacon': upgrade('Fleet Beacon', '+100% Airplane power</br>+200% at 50 Airplanes</br>+300% at 100 Airplanes', 1750000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Airplane', 25)
  ]),
  'The Awakening': upgrade('The Awakening', 'Djinn sacrifice current power to reach full potential', 5000000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Djinn', 10)
  ]),
  'Audible Motivation': upgrade('Audible Motivation', '+2% Djinn power per AutoClicker. +1% AutoClicker power per Djinn', 10000000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Djinn', 15),
    preReq(Constants.PREREQ.HELPER.NUMBER, 'AutoClicker', 15)
  ]),
  'Efficient Operations': upgrade('Efficient Operations', 'Each Robot has a chance to upgrade the base power of Cloners', 20000000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Robot', 20),
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Cloner', 20)
  ], function(abbreviate, { isClass }) {
    const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
    const description = isClass(Constants.CLASSES.MECHANIC) ?
                          this.description.concat(` (2x ${Constants.CLASSES.MECHANIC.name} rate)`)
                          : this.description
    return this.buyable ? `${this.name}</br>${description}</br>${costPhrase}` : `${this.name}</br>${description}`
  })
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
  'Sturdy Frames': {
    ...special('Sturdy Frames', 'Garbage Trucks remove more toxicity', 500, Constants.PRICE_GROWTH.SPECIAL, [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Garbage Truck', 5)
    ]),
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

export default {
  helpers: helpers,
  upgrades: upgrades,
  towers: towers,
  specials: specials
}