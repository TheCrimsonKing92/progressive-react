const CURRENCY_BLOCK_BLUE = 'blue-block'
const CURRENCY_BLOCK_GREEN = 'green-block'
const CURRENCY_SCORE = 'score'

const idMap = (ob, index) => ({...ob, id: index})

const buyable = (name = 'Buyable', description = 'A buyable', price = 1, currency = CURRENCY_SCORE, buyable = false, multiple = false) => ({
  name: name,
  description: description,
  price: price,
  buyable: buyable,
  purchased: 0,
  multiple: multiple
})

const helper = (name = 'Helper', description = 'A helper', price = 1, power = 1, toxicity = 1) => ({
  ...buyable(name, description, price, CURRENCY_SCORE, true, false),
  power: power,
  toxicity: toxicity
})

const helpers = [
  helper('AutoClicker', 'Weakly clicks the button for you', 50, 1, 1),
  helper('Hammer', 'Earns score by smashing the button', 250, 5, 2),
  helper('Robot', 'An AI optimizing score production routines', 1000, 10, 5),
  helper('Airplane', 'An allied airplane to drop score en masse', 15000, 50, 18),
  helper('Cloner', 'Creates perfect score by cloning parts of the button', 50000, 100, 60),
  helper('Djinn', 'An ancient fire spirit mystically connected to the source', 300000, 250, 100),
  helper('Consumer', 'An anti-helper that consumes score to produce blocks', 5000, -1, 0)
].map(idMap)

const upgrade = (name = 'Upgrade', description = 'An upgrade', price = 1, currency = CURRENCY_SCORE, preReqs = null) => ({
  ...buyable(name, description, price, currency, false, false),
  preReqs: preReqs
})

const upgrades = [
  upgrade('Helping Hand', '+1 AutoClicker power', 200),
  upgrade('Click Efficiency', 'Double AutoClicker and mouse power', 500),
  upgrade('Heavier Hammers', 'Double Hammer power', 1250),
  upgrade('Helping Handsier', '+4 AutoClicker and mouse power', 2500),
  upgrade('Cybernetic Synergy', '+8 power per Hammer and Robot pair', 9000),
  upgrade('Helping Handsiest', '+16 AutoClicker and mouse power', 11000),
  upgrade('Extended Cargo', '+25% Airplane power', 23000),
  upgrade('Buddy System', '+100% Airplane power', 85000),
  upgrade('Cloner Overdrive', '+40% Cloner power', 300000),
  upgrade('The Awakening', 'Djinn sacrifice current power to reach full potential', 2500000),
  upgrade('Audible Motivation', '+2% Djinn power per AutoClicker. +1% AutoClicker power per Djinn')
].map(idMap)

const tower = (name = 'Tower', description = 'A tower', price = 1, currency = CURRENCY_BLOCK_BLUE, preReqs = null) => ({
  ...buyable(name, description, price, currency, false, false),
  preReqs: preReqs
})

const towers = [
  tower('Click Tower', 'Increases mouse power by 5% of clicks and 1% of helper power', 10000),
  tower('Cost Tower', 'Reduces score costs by 10%', 5000),
  tower('Power Tower', 'Increases helper power', 2500),
  tower('Toxicity Tower', 'Reduces helper toxicity production', 5000)
].map(idMap)

const special = (name = 'Special', description = 'A special', price = 1, currency = CURRENCY_BLOCK_GREEN, preReqs = null) => ({
  ...buyable(name, description, price, currency, false, true),
  preReqs: preReqs
})

const specials = [
  special('Blue Block', 'A blue block', 5),
  special('Green Block', 'A green block', 5, CURRENCY_BLOCK_BLUE),
  special('Tamer', 'Tames a consumer\'s hunger by 5%', 150),
  special('Toxicity Recycling', 'Removes 10 toxicity')
]

export default {
  helpers: helpers,
  upgrades: upgrades,
  towers: towers,
  specials: specials
}