import React, {Fragment} from 'react';

import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker,
} from "react-simple-maps"

import world from './Static/world-50m.json';

const include = [
    "ARG", "BOL", "BRA", "CHL", "COL", "ECU",
    "GUY", "PRY", "PER", "SUR", "URY", "VEN",
]

const markers = [
    { markerOffset: -25, name: "Buenos Aires", coordinates: [-58.3816, -34.6037] },
    { markerOffset: -25, name: "La Paz", coordinates: [-68.1193, -16.4897] },
    { markerOffset: 35, name: "Brasilia", coordinates: [-47.8825, -15.7942] },
    { markerOffset: 35, name: "Santiago", coordinates: [-70.6693, -33.4489] },
    { markerOffset: 35, name: "Bogota", coordinates: [-74.0721, 4.7110] },
    { markerOffset: 35, name: "Quito", coordinates: [-78.4678, -0.1807] },
    { markerOffset: -25, name: "Georgetown", coordinates: [-58.1551, 6.8013] },
    { markerOffset: -25, name: "Asuncion", coordinates: [-57.5759, -25.2637] },
    { markerOffset: 35, name: "Paramaribo", coordinates: [-55.2038, 5.8520] },
    { markerOffset: 35, name: "Montevideo", coordinates: [-56.1645, -34.9011] },
    { markerOffset: -25, name: "Caracas", coordinates: [-66.9036, 10.4806] },
]

export default class VectorMapsMarkers extends React.Component {

    render() {

        return (
            <Fragment>
                <ComposableMap
                    projectionConfig={{scale: 605}}
                    width={980}
                    height={551}
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                >
                    <ZoomableGroup center={[ -30, -25 ]} disablePanning>
                        <Geographies geography={world}>
                            {(geographies, projection) =>
                                geographies.map((geography, i) =>
                                    include.indexOf(geography.id) !== -1 && (
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
                                    )
                                )
                            }
                        </Geographies>
                        <Markers>
                            {markers.map((marker, i) => (
                                <Marker
                                    key={i}
                                    marker={marker}
                                    style={{
                                        default: { fill: "#3f6ad8" },
                                        hover: { fill: "#FFFFFF" },
                                        pressed: { fill: "#3f6ad8" },
                                    }}
                                >
                                    <circle
                                        cx={0}
                                        cy={0}
                                        r={10}
                                        style={{
                                            stroke: "#3f6ad8",
                                            strokeWidth: 3,
                                            opacity: 0.9,
                                        }}
                                    />
                                    <text
                                        textAnchor="middle"
                                        y={marker.markerOffset}
                                        style={{
                                            fontFamily: "Bariol, sans-serif",
                                            fill: "#adb5bd",
                                        }}
                                    >
                                        {marker.name}
                                    </text>
                                </Marker>
                            ))}
                        </Markers>
                    </ZoomableGroup>
                </ComposableMap>
            </Fragment>
        )
    }
}