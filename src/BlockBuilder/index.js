import Constants from '../Constants'

const getBlockFragmentsBuilt = (store, builder, getHelper, getSpecial) => {
  let consumers = getHelper(Constants.HELPERS.Consumer.name).purchased
  let blueBuilt = 0
  let greenBuilt = 0
  const base = builder ? Constants.BLOCK_GENERATION_RATE_BUILDER :
                         Constants.BLOCK_GENERATION_RATE
  const bonus = getSpecial(Constants.SPECIALS.BetterBuilding.name, store).purchased
  const total = base + bonus

  while (consumers > 0) {
    if (Math.random() > Constants.BLOCK_GENERATION_FAILURE_RATE) {
      if (Math.random() > Constants.BLOCK_GENERATION_BLUE_RATE) {
        blueBuilt += total
      } else {
        greenBuilt += total
      }
    }
    consumers--
  }

  return { greenBuilt, blueBuilt }
}

const getBlockStatus = (greenFragments, blueFragments, builder) => {
  let green = 0
  let blue = 0

  const limit = builder ? Constants.BLOCK_FRAGMENT_LIMIT_BUILDER :
                          Constants.BLOCK_FRAGMENT_LIMIT

  while (greenFragments >= limit) {
    green++
    greenFragments -= limit
  }
  
  while (blueFragments >= limit) {
    blue++
    blueFragments -= limit
  }

  return { blueFragments, blue, greenFragments, green }
}

export default {
  getBlockStatus,
  getBlockFragmentsBuilt
}