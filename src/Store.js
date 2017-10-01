import './Store.css'

const CURRENCY_BLOCK_BLUE = 'blue-block'
const CURRENCY_BLOCK_GREEN = 'green-block'
const CURRENCY_SCORE = 'score'

const HELPER_PRICE_GROWTH = 1.08
const SPECIAL_PRICE_GROWTH = 1.10
const UPGRADE_PRICE_GROWTH = 1.00

const buyable = (name = 'Buyable', description = 'A buyable', price = 1, priceGrowth = HELPER_PRICE_GROWTH, currency = CURRENCY_SCORE, buyable = false, multiple = false) => ({
  name: name,
  description: description,
  price: price,
  priceGrowth: priceGrowth,
  currency: currency,
  buyable: buyable,
  purchased: 0,
  multiple: multiple
})

const helper = (name = 'Helper', description = 'A helper', price = 1, priceGrowth = HELPER_PRICE_GROWTH, power = 1, toxicity = 1) => ({
  ...buyable(name, description, price, priceGrowth, CURRENCY_SCORE, true, false),
  power: power,
  toxicity: toxicity,
  type: 'helper'
})

const helpers = {
  'AutoClicker': helper('AutoClicker', 'Weakly clicks the button for you', 50),
  'Hammer': helper('Hammer', 'Earns score by smashing the button', 250, HELPER_PRICE_GROWTH, 5, 2),
  'Robot': helper('Robot', 'An AI optimizing score production routines', 1000, HELPER_PRICE_GROWTH, 10, 5),
  'Airplane': helper('Airplane', 'An allied airplane to drop score en masse', 15000, HELPER_PRICE_GROWTH, 50, 18),
  'Cloner': helper('Cloner', 'Creates perfect score by cloning parts of the button', 50000, HELPER_PRICE_GROWTH, 100, 60),
  'Djinn': helper('Djinn', 'An ancient fire spirit mystically connected to the source', 300000, HELPER_PRICE_GROWTH, 250, 100),
  'Consumer': helper('Consumer', 'An anti-helper that consumes score to produce blocks. WARNING: These can produce negative score gain!', 5000, HELPER_PRICE_GROWTH, -1, 0)
}

const upgrade = (name = 'Upgrade', description = 'An upgrade', price = 1, currency = CURRENCY_SCORE, preReqs = null) => ({
  ...buyable(name, description, price, UPGRADE_PRICE_GROWTH, currency, false, false),
  preReqs: preReqs,
  type: 'upgrade'
})

const upgrades = {
  'Helping Hand': Object.assign({}, upgrade('Helping Hand', '+1 AutoClicker power', 200), {buyable: true}),
  'Click Efficiency': upgrade('Click Efficiency', 'Double AutoClicker and mouse power', 500),
  'Heavier Hammers': upgrade('Heavier Hammers', 'Double Hammer power', 1250),
  'Helping Handsier': upgrade('Helping Handsier', '+4 AutoClicker and mouse power', 2500),
  'Cybernetic Synergy': upgrade('Cybernetic Synergy', '+8 power per Hammer and Robot pair', 9000),
  'Helping Handsiest': upgrade('Helping Handsiest', '+16 AutoClicker and mouse power', 11000),
  'Extended Cargo': upgrade('Extended Cargo', '+25% Airplane power', 23000),
  'Buddy System': upgrade('Buddy System', '+100% Airplane power', 85000),
  'Cloner Overdrive': upgrade('Cloner Overdrive', '+40% Cloner power', 300000),
  'The Awakening': upgrade('The Awakening', 'Djinn sacrifice current power to reach full potential', 2500000),
  'Audible Motivation': upgrade('Audible Motivation', '+2% Djinn power per AutoClicker. +1% AutoClicker power per Djinn')
}

const tower = (name = 'Tower', description = 'A tower', price = 1, currency = CURRENCY_BLOCK_BLUE, preReqs = null) => ({
  ...buyable(name, description, price, UPGRADE_PRICE_GROWTH, currency, false, false),
  preReqs: preReqs,
  type: 'tower'
})

const towers = {
  'Click Tower': tower('Click Tower', 'Increases mouse power by 5% of clicks and 1% of helper power', 10000),
  'Cost Tower': tower('Cost Tower', 'Reduces score costs by 10%', 5000),
  'Power Tower': tower('Power Tower', 'Increases helper power', 2500),
  'Toxicity Tower': tower('Toxicity Tower', 'Reduces helper toxicity production', 5000)
}

const special = (name = 'Special', description = 'A special', price = 1, priceGrowth = SPECIAL_PRICE_GROWTH, currency = CURRENCY_BLOCK_GREEN, preReqs = null) => ({
  ...buyable(name, description, price, SPECIAL_PRICE_GROWTH, currency, false, true),
  preReqs: preReqs,
  type: 'special'
})

const specials = {
  'Blue Block': special('Blue Block', 'A blue block', 5, SPECIAL_PRICE_GROWTH),
  'Green Block': special('Green Block', 'A green block', 5, SPECIAL_PRICE_GROWTH, CURRENCY_BLOCK_BLUE),
  'Tamer': special('Tamer', 'Tames a consumer\'s hunger by 5%', 150, SPECIAL_PRICE_GROWTH),
  'Toxicity Recycling': special('Toxicity Recycling', 'Removes 10 toxicity', 50, SPECIAL_PRICE_GROWTH)
}

export default {
  helpers: helpers,
  upgrades: upgrades,
  towers: towers,
  specials: specials
}