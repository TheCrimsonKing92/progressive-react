import React, {Component} from 'react'
import {Row, Panel} from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'

class StorePanel extends Component {
	constructor(props) {
		super(props)

		this.handlePurchase = this.handlePurchase.bind(this)
	}
	handlePurchase(buyable) {
		this.props.onPurchase(buyable)
	}
	render() {
		const store = this.props.store

		const mapBuyable = (buyable, id) => {
			const className = buyable.name.replace(' ', '-').toLowerCase()
			const price = Math.floor(buyable.price * Math.pow(buyable.priceGrowth, buyable.purchased))
			const tooltip = `${buyable.name}: ${buyable.description}. Costs ${price} ${buyable.currency}.`
			return (
			<div data-tip={tooltip} key={id} className={`buyable ${className}`} onClick={() => this.handlePurchase(buyable)}>
				<ReactTooltip  />
			</div>
			)
		}

		const helpers = Object.values(store.helpers)
		const helperElements = helpers.map(mapBuyable)

		const upgrades = Object.values(store.upgrades)
		const upgradeElements = upgrades.map(mapBuyable)

		const towers = Object.values(store.towers)
		const towerElements = towers.map(mapBuyable)

		const specials = Object.values(store.specials)
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