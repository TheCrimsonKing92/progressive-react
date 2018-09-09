import React, {PureComponent} from 'react'
import {Panel} from 'react-bootstrap'
import { getMapBuyable } from './store-panel-commons'
import Helpers from './helpers'
import Specials from './specials'
import Towers from './towers'
import Upgrades from './upgrades'

class StorePanel extends PureComponent {
  constructor(props) {
    super(props)

    this.mapBuyable = getMapBuyable(this.props.purchaseHandling, this.props.onPurchase)
  }
	render() {
    const { helpers, towers, specials, upgrades } = this.props.store
    const mapBuyable = getMapBuyable(this.props.purchaseHandling, this.props.onPurchase)

		return (
			<div className="StorePanel">
				<Panel>
					<p>The Store</p>
					<Helpers
            mapBuyable={mapBuyable} 
            helpers={helpers} 
          />
					<Upgrades
            mapBuyable={mapBuyable}
            purchaseHandling={this.props.purchaseHandling}
            upgrades={upgrades}
          />
					<Towers
            mapBuyable={mapBuyable}
            purchaseHandling={this.props.purchaseHandling}
            towers={towers}
          />
					<Specials
            mapBuyable={mapBuyable}
            purchaseHandling={this.props.purchaseHandling}
            specials={specials}
          />
				</Panel>
			</div>
		);
	}
}

export default StorePanel