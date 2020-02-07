import React, {Fragment} from 'react';

import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker,
} from "react-simple-maps"

import {Motion, spring} from "react-motion"

import world from './Static/world-110m.json';

import {
    Button,
} from 'reactstrap';

const cities = [
    {name: "Zurich", coordinates: [8.5417, 47.3769]},
    {name: "Singapore", coordinates: [103.8198, 1.3521]},
    {name: "San Francisco", coordinates: [-122.4194, 37.7749]},
    {name: "Sydney", coordinates: [151.2093, -33.8688]},
    {name: "Lagos", coordinates: [3.3792, 6.5244]},
    {name: "Buenos Aires", coordinates: [-58.3816, -34.6037]},
    {name: "Shanghai", coordinates: [121.4737, 31.2304]},
]

export default class VectorMapsAnimated extends React.Component {
    constructor() {
        super()
        this.state = {
            center: [0, 20],
            zoom: 1,
        }
        this.handleZoomIn = this.handleZoomIn.bind(this)
        this.handleZoomOut = this.handleZoomOut.bind(this)
        this.handleCityClick = this.handleCityClick.bind(this)
        this.handleReset = this.handleReset.bind(this)
    }

    handleZoomIn() {
        this.setState({
            zoom: this.state.zoom * 2,
        })
    }

    handleZoomOut() {
        this.setState({
            zoom: this.state.zoom / 2,
        })
    }

    handleCityClick(city) {
        this.setState({
            zoom: 2,
            center: city.coordinates,
        })
    }

    handleReset() {
        this.setState({
            center: [0, 20],
            zoom: 1,
        })
    }

    render() {

        return (
            <Fragment>
                <div>
                    <div className="text-center mb-2">
                        <Button color="primary" className="mr-1" onClick={this.handleZoomIn}>
                            {"Zoom in"}
                        </Button>
                        <Button color="primary" className="mr-2" onClick={this.handleZoomOut}>
                            {"Zoom out"}
                        </Button>
                        <Button color="secondary" onClick={this.handleReset}>
                            {"Reset"}
                        </Button>
                    </div>
                    <Motion
                        defaultStyle={{
                            zoom: 1,
                            x: 0,
                            y: 20,
                        }}
                        style={{
                            zoom: spring(this.state.zoom, {stiffness: 210, damping: 20}),
                            x: spring(this.state.center[0], {stiffness: 210, damping: 20}),
                            y: spring(this.state.center[1], {stiffness: 210, damping: 20}),
                        }}
                    >
                        {({zoom, x, y}) => (
                            <ComposableMap
                                projectionConfig={{scale: 205}}
                                width={980}
                                height={551}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                }}
                            >
                                <ZoomableGroup center={[x, y]} zoom={zoom}>
                                    <Geographies geography={world}>
                                        {(geographies, projection) =>
                                            geographies.map((geography, i) => geography.id !== "010" && (
                                                <Geography
                                                    key={i}
                                                    geography={geography}
                                                    projection={projection}
                                                    style={{
                                                        default: {
                                                            fill: "#e9ecef",
                                                            stroke: "#adb5bd",
                                                            strokeWidth: 0.75,
                                                            outline: "none",
                                                        },
                                                        hover: {
                                                            fill: "#CFD8DC",
                                                            stroke: "#adb5bd",
                                                            strokeWidth: 0.75,
                                                            outline: "none",
                                                        },
                                                        pressed: {
                                                            fill: "#3f6ad8",
                                                            stroke: "#adb5bd",
                                                            strokeWidth: 0.75,
                                                            outline: "none",
                                                        },
                                                    }}
                                                />
                                            ))}
                                    </Geographies>
                                    <Markers>
                                        {cities.map((city, i) => (
                                            <Marker
                                                key={i}
                                                marker={city}
                                                onClick={this.handleCityClick}
                                            >
                                                <circle
                                                    cx={0}
                                                    cy={0}
                                                    r={6}
                                                    fill="#3f6ad8"
                                                    stroke="#DF3702"
                                                />
                                            </Marker>
                                        ))}
                                    </Markers>
                                </ZoomableGroup>
                            </ComposableMap>
                        )}
                    </Motion>
                </div>
            </Fragment>
        )
    }
}