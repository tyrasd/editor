import React from 'react'
import Immutable from 'immutable'

import Heading from 'rebass/dist/Heading'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import { SourceEditor } from './editor.jsx'
import scrollbars from '../scrollbars.scss'
import PureRenderMixin from 'react-addons-pure-render-mixin';

// List of collapsible layer editors
export class SourceList extends React.Component {
	static propTypes = {
		sources: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	}

	constructor(props) {
		super(props)
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render() {
		const sourceEditors = this.props.sources.map((source, sourceId) => {
			return <SourceEditor
				key={sourceId}
				sourceId={sourceId}
				source={source}
			/>
		}).toIndexedSeq()

		return <div>
			<Toolbar style={{marginRight: 20}}>
				<NavItem>
					<Heading>Sources</Heading>
				</NavItem>
				<Space auto x={1} />
			</Toolbar>
			{sourceEditors}
		</div>
	}
}
