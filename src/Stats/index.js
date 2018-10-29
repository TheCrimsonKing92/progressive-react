const getDefaultStats = () => {
  return {
    awakening: 0,
    awakeningTick: 0,
    blocks: {
      blue: 0,
      blueFragments: 0,
      green: 0,
      greenFragments: 0
    },
    clicks: 0,
    efficientOperations: 0,
    lastTime: new Date(),
    selectedClass: null,
    score: 0,
    toxicity: 0,
    toxicityLimit: 100
  }
}

export default {
  getDefaultStats
}