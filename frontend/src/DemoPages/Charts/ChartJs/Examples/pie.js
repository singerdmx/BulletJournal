import React from 'react';
import {Pie} from 'react-chartjs-2';

const data = {
	labels: [
        'Cars',
        'Trains',
        'Airplanes'
	],
	datasets: [{
		data: [300, 50, 100],
		backgroundColor: [
		'#8dace7',
		'#71deb9',
		'#ef869e'
		],
		hoverBackgroundColor: [
		'#8dace7',
		'#71deb9',
		'#ef869e'
		]
	}]
};

class PieExample extends React.Component {

    render() {
        return (
			<div>
				<Pie dataKey="value" data={data} />
			</div>
        )
    }
}


export default PieExample;