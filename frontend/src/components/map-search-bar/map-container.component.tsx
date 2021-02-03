import React, { useContext } from 'react';
import GoogleMapReact from 'google-map-react';
import { LocationContext } from './search-bar.component';
import './map-container.styles.less';

const Marker = (props: any) => {
	const { color, name } = props;
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
		const { setLocation } = location;

		const handleApiLoaded = (map:any, maps:any) => {
			let infoWindow:any = null;
			let geocoder = new maps.Geocoder();
			map.addListener("click", (mapsMouseEvent:any) => {
				infoWindow && infoWindow.close();
				infoWindow = new maps.InfoWindow({
					position: mapsMouseEvent.latLng,
				});
				geocoder.geocode(
					{ location: mapsMouseEvent.latLng},
					(
						results: google.maps.GeocoderResult[],
						status: google.maps.GeocoderStatus) => {
							if(status === "OK"){
								if(results[0]){
									setLocation(results[0].formatted_address);
									infoWindow.setContent(
										`<p>${results[0].formatted_address}</p>`
									);
								}
							}
					}
				);
				infoWindow.open(map);
			});
		}
		return (
			<div className="mapBase">
				<GoogleMapReact
					bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '' }}
					defaultZoom={8}
					center={{lat: location.latitude, lng: location.longitude }}
					onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
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