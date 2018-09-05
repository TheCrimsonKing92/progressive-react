import Constants from '../Constants'
import { buyable, baseTooltip, preReq } from './store-commons'

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

const firmwareDescription = percentage => '+'.concat(percentage).concat('% Robot power')
const firmwareVersion = version => 'Firmware V1.0.'.concat(version)
const firmwareUpgrade = (version, percentage, cost, robots) => {
  return upgrade(
    firmwareVersion(version),
    firmwareDescription(percentage),
    cost,
    [
      preReq(Constants.PREREQ.HELPER.NUMBER, 'Robot', robots)
    ]
  )
}

const upgrades = {
  'Helping Hand': {
    ...upgrade('Helping Hand', '+1 AutoClicker and mouse power', 200),
    buyable: true,
    getTooltip: baseTooltip
  },
  'Firmware V1.0.0.1': firmwareUpgrade('0.1', 15, 800, 1),
  'Click Efficiency': upgrade('Click Efficiency', '+100% AutoClicker and mouse power', 1000, [
    preReq(Constants.PREREQ.CLICKS.NUMBER, null, 150),
    preReq(Constants.PREREQ.HELPER.NUMBER, 'AutoClicker', 10)
  ]),
  'Firmware V1.0.0.2': firmwareUpgrade('0.2', 15, 1100, 2),
  'Heavier Hammers': upgrade('Heavier Hammers', '+100% Hammer power', 1250, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Hammer', 5)
  ]),
  'Firmware V1.0.0.3': firmwareUpgrade('0.3', 15, 1400, 3),
  'Firmware V1.0.0.4': firmwareUpgrade('0.4', 15, 1800, 4),
  'Firmware V1.0.0.5': firmwareUpgrade('0.5', 15, 2200, 5),
  'Helping Handsier': upgrade('Helping Handsier', '+2 AutoClicker and mouse power', 2500, [
    preReq(Constants.PREREQ.CLICKS.NUMBER, null, 300),
    preReq(Constants.PREREQ.UPGRADE.PURCHASED, 'Helping Hand')
  ]),
  'Firmware V1.0.0.6': firmwareUpgrade('0.6', 15, 2600, 6),
  'Firmware V1.0.0.7': firmwareUpgrade('0.7', 15, 3200, 7),
  'Firmware V1.0.0.8': firmwareUpgrade('0.8', 15, 4100, 8),
  'Helping Handsiest': upgrade('Helping Handsiest', '+6 AutoClicker and mouse power', 7000, [
    preReq(Constants.PREREQ.CLICKS.NUMBER, null, 500),
    preReq(Constants.PREREQ.UPGRADE.PURCHASED, 'Helping Handsier')
  ]),
  'Firmware V1.0.0.9': firmwareUpgrade('0.9', 15, 5100, 9),
  'Firmware V1.0.0.10': firmwareUpgrade('0.10', 15, 6300, 10),
  'Cybernetic Synergy': upgrade('Cybernetic Synergy', '+100% Robot power when paired with a Hammer', 9000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Hammer', 10),
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Robot', 10)
  ], function(abbreviate, isClass) {
    const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
    const description = isClass(Constants.CLASSES.MECHANIC) ? 
                          this.description.replace('+100', '+200').concat(` (+100% ${Constants.CLASSES.MECHANIC.name} bonus)`) 
                          : this.description
    return this.buyable ? `${this.name}</br>${description}</br>${costPhrase}` : `${this.name}</br>${description}`
  }),
  'Firmware V1.0.1.0': firmwareUpgrade('1.0', 75, 20000, 15),
  'Extended Cargo': upgrade('Extended Cargo', '+25% Airplane power', 23000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Airplane', 10)
  ]),
  'Buddy System': upgrade('Buddy System', '+100% Airplane power', 85000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Airplane', 15)
  ]),
  'Cloner Overdrive': upgrade('Cloner Overdrive', '+40% Cloner power', 300000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Cloner', 10)
  ]),
  'Aria Hammera': upgrade('Aria Hammera', '+1 Hammer power per 15 Hammers', 600000, [
    preReq(Constants.PREREQ.HELPER.NUMBER, 'Hammer', 15)
  ]),
  'Fleet Beacon': upgrade('Fleet Beacon', '+150% Airplane power. +250% at 75 Airplanes', 1750000, [
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
  ], function(abbreviate, isClass) {
    const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
    const description = isClass(Constants.CLASSES.MECHANIC) ?
                          this.description.concat(` (2x ${Constants.CLASSES.MECHANIC.name} rate)`)
                          : this.description
    return this.buyable ? `${this.name}</br>${description}</br>${costPhrase}` : `${this.name}</br>${description}`
  })
}

export default upgrades