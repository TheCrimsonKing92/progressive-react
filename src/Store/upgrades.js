import Constants from '../Constants'
import { buyable, baseTooltip, preReq } from './store-commons'

const upgrade = (
  name = 'Upgrade',
  description = 'An upgrade',
  price = 1,
  preReqs = null,
  tooltip = baseTooltip) => 
({
  ...buyable(
    name,
    description,
    price,
    Constants.PRICE_GROWTH.UPGRADE,
    Constants.CURRENCY.SCORE,
    preReqs === null,
    false
  ),
  type: Constants.BUYABLE_TYPE.UPGRADE,
  preReqs: preReqs,
  getTooltip: tooltip
})

const buyableUpgrade = (
  name,
  description,
  price,
  tooltip
) =>
({
  ...upgrade(
    name,
    description,
    price,
    undefined,
    tooltip
  ),
  buyable: true
})

const firmwares = Object.values(Constants.UPGRADES.FIRMWARES)
                        .reduce((acc, curr) => {
                          const label = curr.name
                          acc[label] = upgrade(
                            label,
                            curr.description,
                            curr.price,
                            [
                              preReq(
                                Constants.PREREQ.HELPER.NUMBER,
                                Constants.HELPERS.Robot.name,
                                curr.preReq.Robot
                              )
                            ]
                          )
                          return acc
                        }, {})

const nonfirmwares = {
  [Constants.UPGRADES.HelpingHand.name]: buyableUpgrade(
    Constants.UPGRADES.HelpingHand.name,
    Constants.UPGRADES.HelpingHand.description,
    Constants.UPGRADES.HelpingHand.price
  ),
  [Constants.UPGRADES.ClickEfficiency.name]: upgrade(
    Constants.UPGRADES.ClickEfficiency.name,
    Constants.UPGRADES.ClickEfficiency.description,
    Constants.UPGRADES.ClickEfficiency.price, [
    preReq(
      Constants.PREREQ.CLICKS.NUMBER,
      null,
      Constants.UPGRADES.ClickEfficiency.preReq.clicks
    ),
    preReq(
      Constants.PREREQ.HELPER.NUMBER,
      Constants.HELPERS.AutoClicker.name,
      Constants.UPGRADES.ClickEfficiency.preReq.AutoClicker
    )
  ]),
  [Constants.UPGRADES.HeavierHammers.name]: upgrade(
    Constants.UPGRADES.HeavierHammers.name,
    Constants.UPGRADES.HeavierHammers.description,
    Constants.UPGRADES.HeavierHammers.price,
    [
      preReq(
        Constants.PREREQ.HELPER.NUMBER,
        Constants.HELPERS.Hammer.name,
        Constants.UPGRADES.HeavierHammers.preReq.Hammer
      )
    ]
  ),
  [Constants.UPGRADES.HelpingHandsier.name]: upgrade(
    Constants.UPGRADES.HelpingHandsier.name,
    Constants.UPGRADES.HelpingHandsier.description,
    Constants.UPGRADES.HelpingHandsier.price,
    [
      preReq(Constants.PREREQ.CLICKS.NUMBER, null, 300),
      preReq(Constants.PREREQ.UPGRADE.PURCHASED, Constants.UPGRADES.HelpingHand.name)
    ]
  ),
  [Constants.UPGRADES.HelpingHandsiest.name]: upgrade(
    Constants.UPGRADES.HelpingHandsiest.name,
    Constants.UPGRADES.HelpingHandsiest.description,
    Constants.UPGRADES.HelpingHandsiest.price,
    [
      preReq(Constants.PREREQ.CLICKS.NUMBER, null, 500),
      preReq(Constants.PREREQ.UPGRADE.PURCHASED, Constants.UPGRADES.HelpingHandsier.name)
    ]
  ),
  [Constants.UPGRADES.CyberneticSynergy.name]: upgrade(
    Constants.UPGRADES.CyberneticSynergy.name,
    Constants.UPGRADES.CyberneticSynergy.description,
    Constants.UPGRADES.CyberneticSynergy.price,
    [
      preReq(Constants.PREREQ.HELPER.NUMBER, Constants.HELPERS.Hammer.name, 10),
      preReq(Constants.PREREQ.HELPER.NUMBER, Constants.HELPERS.Robot.name, 10)
    ],
    function(abbreviate, isClass) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const description = isClass(Constants.CLASSES.MECHANIC) ? 
                            this.description.replace('100', '200').concat(` (+100% ${Constants.CLASSES.MECHANIC.name} bonus)`) 
                            : this.description
      return this.buyable ? `${this.name}</br>${description}</br>${costPhrase}` : `${this.name}</br>${description}`
    }
  ),
  [Constants.UPGRADES.ExtendedCargo.name]: upgrade(
    Constants.UPGRADES.ExtendedCargo.name,
    Constants.UPGRADES.ExtendedCargo.description,
    Constants.UPGRADES.ExtendedCargo.price,
      [
      preReq(
        Constants.PREREQ.HELPER.NUMBER,
        Constants.HELPERS.Airplane.name,
        Constants.UPGRADES.ExtendedCargo.preReq.Airplane
      )
    ]
  ),
  [Constants.UPGRADES.BuddySystem.name]: upgrade(
    Constants.UPGRADES.BuddySystem.name,
    Constants.UPGRADES.BuddySystem.description,
    Constants.UPGRADES.BuddySystem.price,
    [
      preReq(Constants.PREREQ.HELPER.NUMBER, Constants.HELPERS.Airplane.name, Constants.UPGRADES.BuddySystem.preReq.Airplane)
    ]
  ),
  [Constants.UPGRADES.ClonerOverdrive.name]: upgrade(
    Constants.UPGRADES.ClonerOverdrive.name,
    Constants.UPGRADES.ClonerOverdrive.description,
    Constants.UPGRADES.ClonerOverdrive.price,
    [
      preReq(Constants.PREREQ.HELPER.NUMBER, Constants.HELPERS.Cloner.name, 10)
    ]
  ),
  [Constants.UPGRADES.AriaHammera.name]: upgrade(
    Constants.UPGRADES.AriaHammera.name,
    Constants.UPGRADES.AriaHammera.description,
    Constants.UPGRADES.AriaHammera.price,
    [
      preReq(Constants.PREREQ.HELPER.NUMBER, Constants.HELPERS.Hammer.name, Constants.UPGRADES.AriaHammera.preReq.Hammer)
    ]
  ),
  [Constants.UPGRADES.FleetBeacon.name]: upgrade(
    Constants.UPGRADES.FleetBeacon.name,
    Constants.UPGRADES.FleetBeacon.description,
    Constants.UPGRADES.FleetBeacon.price,
    [
      preReq(Constants.PREREQ.HELPER.NUMBER, Constants.HELPERS.Airplane.name, Constants.UPGRADES.FleetBeacon.preReq.Airplane)
    ]
  ),
  [Constants.UPGRADES.TheAwakening.name]: upgrade(
    Constants.UPGRADES.TheAwakening.name,
    Constants.UPGRADES.TheAwakening.description,
    Constants.UPGRADES.TheAwakening.price,
    [
      preReq(
        Constants.PREREQ.HELPER.NUMBER,
        Constants.HELPERS.Djinn.name,
        Constants.UPGRADES.TheAwakening.preReq.Djinn
      )
    ]
  ),
  [Constants.UPGRADES.AudibleMotivation.name]: upgrade(
    Constants.UPGRADES.AudibleMotivation.name,
    Constants.UPGRADES.AudibleMotivation.description,
    Constants.UPGRADES.AudibleMotivation.price,
    [
      preReq(
        Constants.PREREQ.HELPER.NUMBER,
        Constants.HELPERS.Djinn.name,
        Constants.UPGRADES.AudibleMotivation.preReq.Djinn
      ),
      preReq(
        Constants.PREREQ.HELPER.NUMBER,
        Constants.HELPERS.AutoClicker.name,
        Constants.UPGRADES.AudibleMotivation.preReq.AutoClicker
      )
    ]
  ),
  [Constants.UPGRADES.EfficientOperations.name]: upgrade(
    Constants.UPGRADES.EfficientOperations.name,
    Constants.UPGRADES.EfficientOperations.description,
    Constants.UPGRADES.EfficientOperations.price,
    [
      preReq(
        Constants.PREREQ.HELPER.NUMBER,
        Constants.HELPERS.Robot.name,
        Constants.UPGRADES.EfficientOperations.preReq.Robot
      ),
      preReq (
        Constants.PREREQ.HELPER.NUMBER,
        Constants.HELPERS.Cloner.name,
        Constants.UPGRADES.EfficientOperations.preReq.Cloner
      )
    ],
    function(abbreviate, isClass) {
      const costPhrase = `Costs ${abbreviate(this.currentPrice)} ${this.currency}`
      const description = isClass(Constants.CLASSES.MECHANIC) ?
                            this.description.concat(` (2x ${Constants.CLASSES.MECHANIC.name} rate)`):
                            this.description
      return this.buyable ? `${this.name}</br>${description}</br>${costPhrase}` : `${this.name}</br>${description}`
  })
}

const upgrades = {
  ...firmwares,
  ...nonfirmwares
}

export default upgrades