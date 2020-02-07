import React, {Fragment} from 'react';

import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
} from "react-simple-maps"

import world from './Static/world-50m.json';

export default class VectorMapsBasic extends React.Component {

    render() {

        return (
            <Fragment>
                <div>
                    <ComposableMap
                        projectionConfig={{
                            scale: 205,
                            rotation: [-11, 0, 0],
                        }}
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                    >
                        <ZoomableGroup center={[0, 20]} disablePanning>
                            <Geographies geography={world}>
                                {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (
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
                                                fill: "#adb5bd",
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
                        </ZoomableGroup>
                    </ComposableMap>
                </div>
            </Fragment>
        )
    }
}