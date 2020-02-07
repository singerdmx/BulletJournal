import React, {Fragment} from 'react';
import {Button, Tooltip} from 'reactstrap';

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
                <Button className="mr-2 mb-2" color="primary" id={'TooltipLight-' + this.props.id}>
                    {this.props.item.text}
                </Button>
                <Tooltip className="tooltip-light" placement={this.props.item.placement} isOpen={this.state.tooltipOpen}
                         target={'TooltipLight-' + this.props.id} toggle={this.toggle}>
                    Tooltip Content!
                </Tooltip>
            </Fragment>
        );
    }
}

class TooltipExampleLight extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltips: [
                {
                    placement: 'auto',
                    text: 'auto'
                },
                {
                    placement: 'top',
                    text: 'top'
                },
                {
                    placement: 'right',
                    text: 'right'
                },
                {
                    placement: 'bottom',
                    text: 'bottom'
                },
                {
                    placement: 'left',
                    text: 'left'
                },
            ]
        };
    }

    render() {
        return (
            <div className="text-center">
                {this.state.tooltips.map((tooltip, i) => {
                    return <TooltipItem key={i} item={tooltip} id={i}/>;
                })}
            </div>
        );
    }
}

export default TooltipExampleLight;
