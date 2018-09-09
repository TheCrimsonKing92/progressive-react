import React, {PureComponent} from 'react'
import {Row, Panel} from 'react-bootstrap'
import Buyable from './Buyable'

const idMap = (buyable, id) => ({
	...buyable,
	id: id
})
const isBuyable = b => b.buyable
const isOneTimeBuyable = b => (b.buyable || (!b.buyable && b.purchased > 0))

class StorePanel extends PureComponent {
	render() {
		const { helpers, towers, specials, upgrades } = this.props.store
		const mapBuyable = buyable => (
			<Buyable 
				key={buyable.id}
				buyable={buyable.buyable}
				fade={this.props.purchaseHandling} 
				id={buyable.id}
				name={buyable.name}
				onPurchase={this.props.onPurchase}
				tooltip={buyable.tooltip}
				type={buyable.type}/>
		)

		const helperElements = Object.values(helpers)
																 .map(idMap)
																 .map(mapBuyable)

		const singularFilter = this.props.purchaseHandling ? isOneTimeBuyable : isBuyable

		const upgradeElements = Object.values(upgrades)
																	.filter(singularFilter)
																	.map(idMap)
																	.map(mapBuyable)

		const towerElements = Object.values(towers)
																.filter(singularFilter)
																.map(idMap)
																.map(mapBuyable)

		const specialElements = Object.values(specials)
																	.filter(isBuyable)
																	.map(idMap)
																	.map(mapBuyable)

		return (
			<div className="StorePanel">
				<Panel>
					<p>The Store</p>
					<Row>
						<p>Helpers</p>
						{helperElements}
					</Row>
					{upgradeElements.some(u => u) &&
					<Row>
						<p>Upgrades</p>
						{upgradeElements}
					</Row>
					}
					{towerElements.some(t => t) &&
					<Row>
						<p>Towers</p>
						{towerElements}
					</Row>
					}
					{specialElements.some(s => s) &&
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