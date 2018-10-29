import Clicker from './index'
import TestUtils from '../TestUtils'

const baseStats = TestUtils.getDefaultStats()
const baseStore = TestUtils.getDefaultStore()

const isNotClass = jest.fn(c => false)
const noHelperOutput = jest.fn(() => 0)
const towerNotPurchased = jest.fn(t => false)
const upgradeNotPurchased = jest.fn(u => false)

// calculateClickScore = (stats, store, getPositiveHelperOutput, isClass, towerPurchased, upgradePurchased)
test('Base non-Master click score is 1', () => {
  const getPositiveHelperOutput = noHelperOutput
  const isClass = isNotClass
  const towerPurchased = towerNotPurchased
  const upgradePurchased = upgradeNotPurchased
  expect(Clicker.calculateClickScore(
    baseStats,
    baseStore,
    getPositiveHelperOutput,
    isClass,
    towerPurchased,
    upgradePurchased
  )).toBe(1)
})

test('Base Master click score is 2', () => {
  const getPositiveHelperOutput = noHelperOutput
  const isClass = jest.fn(c => true)
  const towerPurchased = towerNotPurchased
  const upgradePurchased = upgradeNotPurchased
  expect(Clicker.calculateClickScore(
    baseStats,
    baseStore,
    getPositiveHelperOutput,
    isClass,
    towerPurchased,
    upgradePurchased
  )).toBe(2)
})