import React, {Fragment} from 'react';
import {Tooltip} from 'reactstrap';

class TooltipItem extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            tooltipOpen: false
        };
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    render() {
        return (
            <Fragment>
                <div className={this.props.item.class} id={'TooltipC-' + this.props.id}/>
                <Tooltip isOpen={this.state.tooltipOpen} target={'TooltipC-' + this.props.id} toggle={this.toggle}>
                    {this.props.item.text}
                </Tooltip>
            </Fragment>
        );
    }
}

class ColorSwatches extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltips: [
                {
                    text: 'Primary',
                    class: 'swatch-holder swatch-holder-lg bg-primary'
                },
                {
                    text: 'Secondary',
                    class: 'swatch-holder swatch-holder-lg bg-secondary'
                },
                {
                    text: 'Success',
                    class: 'swatch-holder swatch-holder-lg bg-success'
                },
                {
                    text: 'Info',
                    class: 'swatch-holder swatch-holder-lg bg-info'
                },
                {
                    text: 'Warning',
                    class: 'swatch-holder swatch-holder-lg bg-warning'
                },
                {
                    text: 'Danger',
                    class: 'swatch-holder swatch-holder-lg bg-danger'
                },
                {
                    text: 'Focus',
                    class: 'swatch-holder swatch-holder-lg bg-focus'
                },
                {
                    text: 'Alt',
                    class: 'swatch-holder swatch-holder-lg bg-alternate'
                },
                {
                    text: 'Light',
                    class: 'swatch-holder swatch-holder-lg bg-light'
                },
                {
                    text: 'Dark',
                    class: 'swatch-holder swatch-holder-lg bg-dark'
                }
            ]
        };
    }

    render() {
        return (
            <Fragment>
                {this.state.tooltips.map((tooltip, i) => {
                    return (
                        <TooltipItem key={i} item={tooltip} id={i}/>
                    )
                })}
            </Fragment>
        );
    }
}

export default ColorSwatches;
