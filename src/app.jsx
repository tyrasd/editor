import React from 'react'
import {saveAs} from 'file-saver'

import Drawer from 'rebass/dist/Drawer'
import Container from 'rebass/dist/Container'
import Block from 'rebass/dist/Block'
import Fixed from 'rebass/dist/Fixed'

import { Map } from './map.jsx'
import {Toolbar} from './toolbar.jsx'
import { StyleManager } from './style.js'
import { loadDefaultStyle, SettingsStore, StyleStore } from './stylestore.js'
import { WorkspaceDrawer } from './workspace.jsx'

import theme from './theme.js'

export default class App extends React.Component {
	static childContextTypes = {
		rebass: React.PropTypes.object,
		reactIconBase: React.PropTypes.object
	}

	constructor(props) {
		super(props)
		this.styleStore = new StyleStore()
		this.settingsStore = new SettingsStore()
		this.state = {
			accessToken: this.settingsStore.accessToken,
			workContext: "layers",
			currentStyle: this.styleStore.latestStyle(),
		}

		loadDefaultStyle(mapStyle => {
			this.onStyleUpload(mapStyle)
		})
	}

	getChildContext() {
		return {
			rebass: theme,
			reactIconBase: { size: 20 }
		}
	}

	onStyleDownload() {
		const mapStyle = JSON.stringify(this.state.currentStyle.toJSON(), null, 4)
		const blob = new Blob([mapStyle], {type: "application/json;charset=utf-8"});
		saveAs(blob, mapStyle.id + ".json");
		this.onStyleSave()
	}

	onStyleUpload(newStyle) {
		const savedStyle = this.styleStore.save(newStyle)
		this.setState({ currentStyle: savedStyle })
	}

	onStyleSave() {
		const snapshotStyle = this.state.currentStyle.set('modified', new Date().toJSON())
		this.setState({ currentStyle: snapshotStyle })
	}

	onStyleChanged(newStyle) {
		this.setState({ currentStyle: newStyle })
	}

	onOpenSettings() {
		this.setState({ workContext: "settings" })
	}

	onOpenAbout() {
		this.setState({ workContext: "about" })
	}

	onOpenLayers() {
		this.setState({ workContext: "layers", })
	}

	onOpenSources() {
		this.setState({ workContext: "sources", })
	}

	onAccessTokenChanged(newToken) {
		this.settingsStore.accessToken = newToken
		this.setState({ accessToken: newToken })
	}

	render() {
		return <div style={{ fontFamily: theme.fontFamily, color: theme.color, fontWeight: 300 }}>
			<Toolbar
					styleAvailable={this.state.currentStyle.get('layers').size > 0}
					onStyleSave={this.onStyleSave.bind(this)}
					onStyleUpload={this.onStyleUpload.bind(this)}
					onStyleDownload={this.onStyleDownload.bind(this)}
					onOpenSettings={this.onOpenSettings.bind(this)}
					onOpenAbout={this.onOpenAbout.bind(this)}
					onOpenLayers={this.onOpenLayers.bind(this)}
					onOpenSources={this.onOpenSources.bind(this)}
			/>
			<WorkspaceDrawer
				onStyleChanged={this.onStyleChanged.bind(this)}
				workContext={this.state.workContext}
				mapStyle={this.state.currentStyle}
				accessToken={this.state.accessToken}
				onAccessTokenChanged={this.onAccessTokenChanged.bind(this)}
			/>
			<Map
				mapStyle={this.state.currentStyle}
				accessToken={this.state.accessToken}
			/>
		</div>
	}
}
