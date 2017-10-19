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
  priceGrowth = Constants.PRICE_GROWTH.HELPER,
  power = 1,
  toxicity = 1) => 
({
  ...buyable(name, description, price, priceGrowth, Constants.CURRENCY.SCORE, true, true),
  power: power,
  toxicity: toxicity,
  type: 'helper'
})

const helpers = {
  'AutoClicker': helper('AutoClicker', 'Weakly clicks the button for you', 100),
  'Hammer': helper('Hammer', 'Earns score by smashing the button', 500, Constants.PRICE_GROWTH.HELPER, 5, 2),
  'Robot': helper('Robot', 'An AI optimizing score production routines', 1500, Constants.PRICE_GROWTH.HELPER, 14, 5),
  'Airplane': helper('Airplane', 'An allied airplane to drop score en masse', 20000, Constants.PRICE_GROWTH.HELPER, 40, 18),
  'Cloner': helper('Cloner', 'Creates score by cloning parts of the button', 100000, Constants.PRICE_GROWTH.HELPER, 100, 60),
  'Djinn': helper('Djinn', 'An ancient fire spirit mystically connected to the button', 3500000, Constants.PRICE_GROWTH.HELPER, 350, 100),
  'Consumer': helper('Consumer', 'An anti-helper that consumes score to produce blocks.</br> WARNING: These can produce negative score gain!', 5000, Constants.PRICE_GROWTH.HELPER, -1, 0)
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
  'Helping Hand': Object.assign({}, upgrade('Helping Hand', '+1 AutoClicker and mouse power', 200), {buyable: true}),
  'Click Efficiency': upgrade('Click Efficiency', '+100% AutoClicker and mouse power', 1000, [
    preReq(Constants.PREREQ.CLICKS.NUMBER, null, 150),
    preReq(Constants.PREREQ.HELPER.NUMBER, 'AutoClicker', 10)
  ]),
  'Heavier Hammers': upgrade('Heavier Hammers', '+100% Hammer power', 1250, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Hammer', 5)
  ]),
  'Helping Handsier': upgrade('Helping Handsier', '+2 AutoClicker and mouse power', 2500, [
    preReq(Constants.PREREQ.CLICKS.NUMBER, null, 300)
  ]),
  'Helping Handsiest': upgrade('Helping Handsiest', '+6 AutoClicker and mouse power', 7000, [
    preReq(Constants.PREREQ.CLICKS.NUMBER, null, 500)
  ]),
  'Cybernetic Synergy': upgrade('Cybernetic Synergy', '+14 power per Hammer and Robot pair', 9000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Hammer', 10),
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Robot', 10)
  ]),
  'Extended Cargo': upgrade('Extended Cargo', '+25% Airplane power', 23000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Airplane', 10)
  ]),
  'Buddy System': upgrade('Buddy System', '+100% Airplane power', 85000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Airplane', 15)
  ]),
  'Cloner Overdrive': upgrade('Cloner Overdrive', '+40% Cloner power', 300000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Cloner', 10)
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
  ])
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
  'Toxicity Tower': tower('Toxicity Tower', 'Reduces helper toxicity production', 5000, [
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
  ...buyable(name, description, price, Constants.PRICE_GROWTH.SPECIAL, Constants.CURRENCY.BLOCK.GREEN, false, true),
  preReqs: preReqs,
  type: 'special'
})

const specials = {
  'Blue Block': special('Blue Block', 'A blue block', 5, Constants.PRICE_GROWTH.SPECIAL, [
    preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
  ]),
  'Green Block': {
    ...special('Green Block', 'A green block', 5, Constants.PRICE_GROWTH.SPECIAL, [
      preReq(Constants.PREREQ.HELPER.PURCHASED, 'Consumer')
    ]),
    currency: Constants.CURRENCY.BLOCK.BLUE
  },
  'Tamer': special('Tamer', 'Tames a consumer\'s hunger by 5%</br>One per consumer owned', 150, Constants.PRICE_GROWTH.SPECIAL, [
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