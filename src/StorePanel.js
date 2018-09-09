import React, {Component} from 'react'
import {Row, Panel} from 'react-bootstrap'
import Buyable from './Buyable'

const idMap = (buyable, id) => ({
	...buyable,
	id: id
})
class StorePanel extends Component {
	render() {
		const store = this.props.store

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
		const isOneTimeBuyable = b => (b.buyable || (!b.buyable && b.purchased > 0))
		const mapBuyable = (buyable, index) => (
			<Buyable 
				key={index}
				buyable={buyable.buyable}
				fade={this.props.purchaseHandling} 
				id={buyable.id}
				name={buyable.name}
				onPurchase={this.props.onPurchase}
				tooltip={buyable.tooltip}
				towerPurchased={towerPurchased}
				type={buyable.type}
				upgradePurchased={upgradePurchased}/>
		)

		const helpers = Object.values(store.helpers).map(idMap)
		const helperElements = helpers.map(mapBuyable)

		const upgrades = this.props.purchaseHandling ? Object.values(store.upgrades).filter(isOneTimeBuyable).map(idMap)
																								: Object.values(store.upgrades).filter(isBuyable).map(idMap)
		const upgradeElements = upgrades.map(mapBuyable)

		const towers = this.props.purchaseHandling ? Object.values(store.towers).filter(isOneTimeBuyable).map(idMap) 
																							 : Object.values(store.towers).filter(isBuyable).map(idMap)
		const towerElements = towers.map(mapBuyable)

		const specials = Object.values(store.specials).filter(isBuyable).map(idMap)
		const specialElements = specials.map(mapBuyable)

		return (
			<div className="StorePanel">
				<Panel>
					<p>The Store</p>
					<Row>
						<p>Helpers</p>
						{helperElements}
					</Row>
					{upgrades.some(u => u) &&
					<Row>
						<p>Upgrades</p>
						{upgradeElements}
					</Row>
					}
					{towers.some(t => t) &&
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