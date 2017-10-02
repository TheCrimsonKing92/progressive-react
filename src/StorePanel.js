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

		const mapBuyable = buyable => (<Buyable buyable={buyable} onPurchase={this.props.onPurchase}/>)

		const helpers = Object.values(store.helpers).map(idMap)
		const helperElements = helpers.map(mapBuyable)

		const upgrades = Object.values(store.upgrades).filter(u => u.buyable).map(idMap)
		const upgradeElements = upgrades.map(mapBuyable)

		const towers = Object.values(store.towers).map(idMap)
		const towerElements = towers.map(mapBuyable)

		const specials = Object.values(store.specials).map(idMap)
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
					{upgrades.some(u => u.buyable) &&
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