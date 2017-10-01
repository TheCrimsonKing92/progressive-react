import React, {Component} from 'react'
import {Row, Panel} from 'react-bootstrap'

class StorePanel extends Component {
	handlePurchase(buyable) {
		this.props.onPurchase(buyable)
	}
	render() {
		const store = this.props.store
		const mapBuyable = buyable => <div className={'buyable' + buyable.name}>{buyable.name}</div>
		const helpers = store.helpers
		const helperElements = store.helpers.map(mapBuyable)
		const upgrades = store.upgrades
		const upgradeElements = store.upgrades.map(mapBuyable)
		const towers = store.towers
		const towerElements = store.towers.map(mapBuyable)
		const specials = store.specials
		const specialElements = store.specials.map(mapBuyable)
		return (
			<div className="StorePanel">
				<Panel>
					The Store
					{
						helpers.some(h => h.buyable) &&
						<Row>
							Helpers
							{helperElements}
						</Row>
					}
					{upgrades.some(u => u.buyable) &&
					<Row>
						Upgrades
						{upgradeElements}
					</Row>
					}
					{towers.some(t => t.buyable) &&
					<Row>
						Towers
						{towerElements}
					</Row>
					}
					{specials.some(s => s.buyable) &&
					<Row>
						Specials
						{specialElements}
					</Row>
					}
				</Panel>
			</div>
		);
	}
}

export default StorePanel