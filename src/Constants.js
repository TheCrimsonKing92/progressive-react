export default {
  AUTOSAVE_FREQUENCIES: [5, 15, 30, 60],
  BLOCK_FRAGMENT_LIMIT: 100,
  BLOCK_FRAGMENT_LIMIT_BUILDER: 75,
  BLOCK_GENERATION_BLUE_RATE: 0.76,
  BLOCK_GENERATION_FAILURE_RATE: 0.02,
  CLASSES: {
    BUILDER: {
      name: 'Builder',
      description: 'Builds blocks (for advanced purchases) faster'
    },
    MASTER: {
      name: 'Master',
      description: 'Increased score from mouse clicks and AutoClickers'
    },
    MECHANIC: {
      name: 'Mechanic',
      description: 'Improved returns from robot-based upgrades'
    },
    THIEF: {
      name: 'Thief',
      description: `Receives 'five-fingered discount' on all store prices`
    }
  },
  CLICK_TOWER: {
    CLICK_RATE: 0.05,
    HELPER_RATE: 0.01
  },
  CURRENCY: {
    BLOCK: {
      BLUE: 'blue-block',
      GREEN: 'green-block'
    },
    SCORE: 'score'
  },
  EFFICIENT_OPERATIONS_FAILURE_RATE: 0.995,
  EFFICIENT_OPERATIONS_FAILURE_RATE_MECHANIC: 0.99,
  LOCALSTORAGE_ITEM_NAME: 'ProgressiveReactSave',
  OFFLINE_PROGRESS_MINIMUM: 60,
  POWER: {
    HELPING_HAND: 1,
    HELPING_HANDSIER: 2,
    HELPING_HANDSIEST: 6
  },
  PREREQ: {
    CLICKS: {
      NUMBER: 'number-clicks'
    },
    HELPER: {
      NUMBER: 'number-helper',
      PURCHASED: 'helper-purchased'
    },
    SPECIAL: {
      NUMBER: 'number-helper',
      PURCHASED: 'special-purchased'
    },
    TOWER: {
      PURCHASED: 'tower-purchased'
    },
    UPGRADE: {
      PURCHASED: 'upgrade-purchased'
    }
  },
  PRICE_GROWTH: {
    HELPER: 1.07,
    HELPER_THIEF: 1.06,
    SPECIAL: 1.10,
    UPGRADE: 1.00
  },
  TOXICITY_RECYCLING_POWER: 5
}