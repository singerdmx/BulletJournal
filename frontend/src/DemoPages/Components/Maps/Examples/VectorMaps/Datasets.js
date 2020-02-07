import React, {Fragment} from 'react';

import {
    Button,
} from 'reactstrap';

import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from "react-simple-maps"
import chroma from "chroma-js"
import {scaleLinear} from "d3-scale"

import world from './Static/world-50m-with-population.json';

const colorScale = chroma
    .scale([
        '#FF6E40',
        'FFD740',
        '#00B8D4',
    ])
    .mode('lch')
    .colors(24)

const subregions = [
    "Southern Asia",
    "Polynesia",
    "Micronesia",
    "Southern Africa",
    "Central Asia",
    "Melanesia",
    "Western Europe",
    "Central America",
    "Seven seas (open ocean)",
    "Northern Africa",
    "Caribbean",
    "South-Eastern Asia",
    "Eastern Africa",
    "Australia and New Zealand",
    "Eastern Europe",
    "Western Africa",
    "Southern Europe",
    "Eastern Asia",
    "South America",
    "Middle Africa",
    "Antarctica",
    "Northern Europe",
    "Northern America",
    "Western Asia",
]

const popScale = scaleLinear()
    .domain([0, 100000000, 1400000000])
    .range(["#CFD8DC", "#adb5bd", "#37474F"])


export default class VectorMapsDatasets extends React.Component {
    constructor() {
        super()

        this.state = {
            populationData: true,
        }

        this.switchToPopulation = this.switchToPopulation.bind(this)
        this.switchToRegions = this.switchToRegions.bind(this)
    }

    switchToPopulation() {
        this.setState({populationData: true})
    }

    switchToRegions() {
        this.setState({populationData: false})
    }

    render() {

        return (
            <Fragment>
                <div className="text-center mb-2">
                    <Button color="primary" className="mr-1" onClick={this.switchToPopulation}>
                        {"Population data"}
                    </Button>
                    <Button color="primary" onClick={this.switchToRegions}>
                        {"World subregions"}
                    </Button>
                </div>
                <div>
                    <ComposableMap
                        projectionConfig={{
                            scale: 205,
                            rotation: [-11, 0, 0],
                        }}
                        width={980}
                        height={551}
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                    >
                        <ZoomableGroup center={[0, 20]}>
                            <Geographies
                                geography={world}
                                disableOptimization
                            >
                                {(geographies, projection) =>
                                    geographies.map((geography, i) => (
                                        <Geography
                                            key={`${geography.properties.iso_a3}-${i}`}
                                            cacheId={`${geography.properties.iso_a3}-${i}`}
                                            geography={geography}
                                            projection={projection}
                                            onClick={this.handleClick}
                                            round
                                            style={{
                                                default: {
                                                    fill: this.state.populationData
                                                        ? popScale(geography.properties.pop_est)
                                                        : colorScale[subregions.indexOf(geography.properties.subregion)],
                                                    stroke: "#adb5bd",
                                                    strokeWidth: 0.75,
                                                    outline: "none",
                                                },
                                                hover: {
                                                    fill: this.state.populationData
                                                        ? "#263238"
                                                        : chroma(colorScale[subregions.indexOf(geography.properties.subregion)]).darken(0.5),
                                                    stroke: "#adb5bd",
                                                    strokeWidth: 0.75,
                                                    outline: "none",
                                                },
                                                pressed: {
                                                    fill: this.state.populationData
                                                        ? "#263238"
                                                        : chroma(colorScale[subregions.indexOf(geography.properties.subregion)]).brighten(0.5),
                                                    stroke: "#adb5bd",
                                                    strokeWidth: 0.75,
                                                    outline: "none",
                                                }
                                            }}
                                        />
                                    ))}
                            </Geographies>
                        </ZoomableGroup>
                    </ComposableMap>
                </div>
            </Fragment>
        )
    }
}