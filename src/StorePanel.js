import React, {Component} from 'react'
import {Row, Panel} from 'react-bootstrap'

class StorePanel extends Component {
	handlePurchase(buyable) {
		this.props.onPurchase(buyable)
	}
	render() {
		const store = this.props.store
		const mapBuyable = ((buyable) =>
			<div className={'buyable' + buyable.className}></div>
		)
		const helpers = store.helpers.map(mapBuyable)
		const upgrades = store.upgrades.map(mapBuyable)
		const towers = store.towers.map(mapBuyable)
		const specials = store.specials.map(mapBuyable)
		return (
			<div className="StorePanel">
				<Panel>
					The Store
					{helpers.some(h => h.buyable) &&
					<Row>
						Helpers
						{helpers}
					</Row>
					}
					{upgrades.some(u => u.buyable) &&
					<Row>
						Upgrades
						{upgrades}
					</Row>
					}
					{towers.some(t => t.buyable) &&
					<Row>
						Towers
						{towers}
					</Row>
					}
					{specials.some(s => s.buyable) &&
					<Row>
						Specials
						{specials}
					</Row>
					}
				</Panel>
			</div>
		);
	}
}

export default StorePanel