import React, {Component} from 'react'
import {Row, Panel} from 'react-bootstrap'
import Buyable from './Buyable'

class StorePanel extends Component {
	render() {
		const store = this.props.store
		const idMap = (buyable, id) => ({
			...buyable,
			id: id
		})

		const towerPurchased = t => {
			const tower = store.towers[t]

			if (!tower) return false

			return tower.purchased
		}

		const upgradePurchased = u => {
			const upgrade = store.upgrades[u]

			if (!upgrade) return false

			return upgrade.purchased
		}

		const isBuyable = b => b.buyable
		const mapBuyable = buyable => (
			<Buyable 
				buyable={buyable} 
				fade={this.props.upgradeHandling} 
				onPurchase={this.props.onPurchase} 
				towerPurchased={towerPurchased} 
				upgradePurchased={upgradePurchased}/>
		)

		const helpers = Object.values(store.helpers).map(idMap)
		const helperElements = helpers.map(mapBuyable)

		const upgrades = this.props.upgradeHandling ? Object.values(store.upgrades).filter(u => u.buyable || !u.buyable && u.purchased > 0).map(idMap) : Object.values(store.upgrades).filter(u => u.buyable).map(idMap)
		const upgradeElements = upgrades.map(mapBuyable)

		const towers = Object.values(store.towers).filter(isBuyable).map(idMap)
		const towerElements = towers.map(mapBuyable)

		const specials = Object.values(store.specials).filter(isBuyable).map(idMap)
		const specialElements = specials.map(mapBuyable)

		return (
			<div className="StorePanel">
				<Panel>
					<p>The Store</p>
					{
						helpers.some(h => h.buyable) &&
						<Row>
							<p>Helpers</p>
							{helperElements}
						</Row>
					}
					{(this.props.upgradeHandling || upgrades.some(u => u.buyable)) &&
					<Row>
						<p>Upgrades</p>
						{upgradeElements}
					</Row>
					}
					{towers.some(t => t.buyable) &&
					<Row>
						<p>Towers</p>
						{towerElements}
					</Row>
					}
					{specials.some(s => s.buyable) &&
					<Row>
						<p>Specials</p>
						{specialElements}
					</Row>
					}
				</Panel>
			</div>
		);
	}
}

export default StorePanel