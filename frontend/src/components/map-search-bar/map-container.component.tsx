import React, { useContext } from 'react';
import GoogleMapReact from 'google-map-react';
import { LocationContext } from './search-bar.component';
import './map-container.styles.less';

const Marker = (props: any) => {
	const { color, name, id } = props;
	return (
		<div>
			<div
				className="pin bounce"
				style={{ backgroundColor: color, cursor: "pointer" }}
				title={name}
			/>
			<div className="pulse" />
		</div>
	);
}


const MapContainer = (props: any) => {
		const location = useContext(LocationContext);
		return (
			<div className="mapBase">
				<GoogleMapReact
					bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '' }}
					defaultZoom={8}
					center={{lat: location.latitude, lng: location.longitude }}
				>
					<Marker
						lat={location.latitude}
						lng={location.longitude}
						name="Location"
						color="red"
					/>
				</GoogleMapReact>
			</div>
		);
	}

export default MapContainer;