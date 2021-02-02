import React from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import MapIndicateIcon from './map-icon.component';
import './search-bar.styles.less';

type SearchBarProps = {
	location: string;
	setLocation: (location: string) => void;
}

type SearchBarState = {
	latitude: number | undefined,
	longitude: number | undefined,
	isGeocoding: boolean,
	errorMessage: string
}

export const DefaultLocation: any = {
	//default location to LA
	latitude: 34.0522342,
	longitude: -118.2436849,
	setLocation: ()=>{},
}

const isObject = (val: any) => {
	return typeof val === 'object' && val !== null;
};

export const LocationContext = React.createContext(DefaultLocation);
  
const classnames = (...args: any[]) => {
	const classes:any[] = [];
	args.forEach(arg => {
	  if (typeof arg === 'string') {
		classes.push(arg);
	  } else if (isObject(arg)) {
		Object.keys(arg).forEach(key => {
		  if (arg[key]) {
			classes.push(key);
		  }
		});
	  } else {
		throw new Error(
		  '`classnames` only accepts string or object as arguments'
		);
	  }
	});
	return classes.join(' ');
};

class SearchBar extends React.Component<SearchBarProps, SearchBarState>{

	state: SearchBarState = {
		latitude: DefaultLocation.latitude,
		longitude: DefaultLocation.longitude,
		isGeocoding: false,
		errorMessage: ''
	}

	handleChange = (address: string) => {
		this.props.setLocation(address);
	}

	componentDidMount() {
		const { location } = this.props;
		if(location === ""){
			navigator.geolocation.getCurrentPosition(
				(position) => {
					this.setState({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						errorMessage: ''
					});
				}, 
				(error) => { 
					console.log("Get location Error: ", error); 
				}, 
				{ 
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 10000
			});
		}else{
			geocodeByAddress(location)
			.then(res => getLatLng(res[0]))
			.then((res) => {
				const { lat, lng } = res;
				this.setState({
					latitude: lat,
					longitude: lng,
					isGeocoding: false
				})
			})
		}
	  }

	handleSelect = (selected: string) => {
		this.props.setLocation(selected);
		this.setState({ isGeocoding: true });
		geocodeByAddress(selected)
			.then(res => getLatLng(res[0]))
			.then((res) => {
				const { lat, lng } = res;
				this.setState({
					latitude: lat,
					longitude: lng,
					isGeocoding: false
				})
			})
	}

	handleError = (status: string, clearSuggestions: Function) => {
		console.log('Error from Google Maps API', status); // eslint-disable-line no-console
		this.setState({ errorMessage: status }, () => {
			clearSuggestions();
		});
	}

	handleCloseClick = () => {
		this.props.setLocation('');
	}
	render() {
		const { latitude, longitude } = this.state;
		const { location, setLocation } = this.props;

		return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
			<PlacesAutocomplete
				onChange={this.handleChange}
				value={location}
				onSelect={this.handleSelect}
				onError={this.handleError}
				shouldFetchSuggestions={location.length > 2}
				>
					{({ getInputProps, suggestions, getSuggestionItemProps }) => {
						return (
							<div className="search-bar-container">
								<div className="search-input-container">
									<input
										{...getInputProps({
										placeholder: 'Search Places...',
										className: 'search-input',
										})}
									/>
									{location.length > 0 && (
										<button
										className="clear-button"
										onClick={this.handleCloseClick}
										>x</button>
									)}
								</div>
								{suggestions.length > 0 && (
									<div className="autocomplete-container">
										{suggestions.map((suggestion, index) => {
										const className = classnames('suggestion-item', {
											'suggestion-item--active': suggestion.active,
										});

										return (
											/* eslint-disable react/jsx-key */
											<div {...getSuggestionItemProps(suggestion, { className })} key={index}>
												<strong>
													{suggestion.formattedSuggestion.mainText}
												</strong>{' '}
												<small>
													{suggestion.formattedSuggestion.secondaryText}
												</small>
											</div>
										);
										})}
									</div>
								)}
							</div>
						);
					}}
				</PlacesAutocomplete>
				<LocationContext.Provider value={{latitude, longitude, setLocation }}>
					<MapIndicateIcon />
				</LocationContext.Provider>
		</div>;
	}
}

export default SearchBar;