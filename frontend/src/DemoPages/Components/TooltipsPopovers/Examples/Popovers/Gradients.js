import React, {Fragment} from 'react';
import {Button, Popover, PopoverHeader, PopoverBody} from 'reactstrap';
class PopoverItem extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false
        };
    }

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        return (
            <span>
                <Button className="mr-2 mb-2" color={this.props.item.btn} id={'PopoverG-' + this.props.id} onClick={this.toggle}>
                    {this.props.item.text}
                </Button>
                <Popover className={this.props.item.color} placement={this.props.item.placement} isOpen={this.state.popoverOpen}
                         target={'PopoverG-' + this.props.id} toggle={this.toggle}>
          <PopoverHeader>{this.props.item.text}</PopoverHeader>
            <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
        </Popover>
      </span>
        );
    }
}

class PopoversGradientsExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popovers: [

                {
                    placement: 'bottom',
                    text: 'Warm Flame',
                    color: 'popover-bg bg-warm-flame text-dark',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Night Fade',
                    color: 'popover-bg bg-night-fade text-dark',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Sunny Morning',
                    color: 'popover-bg bg-sunny-morning text-dark',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Tempting Azure',
                    color: 'popover-bg bg-tempting-azure text-dark',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Amy Crisp',
                    color: 'popover-bg bg-amy-crisp text-dark',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Heavy Rain',
                    color: 'popover-bg bg-heavy-rain text-dark',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Mean Fruit',
                    color: 'popover-bg bg-mean-fruit text-dark',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Malibu Beach',
                    color: 'popover-bg bg-malibu-beach text-dark',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Deep Blue',
                    color: 'popover-bg bg-deep-blue text-dark',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Ripe Malin',
                    color: 'popover-bg bg-ripe-malin',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Arielle Smile',
                    color: 'popover-bg bg-arielle-smile',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Plum Plate',
                    color: 'popover-bg bg-plum-plate',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Happy Fisher',
                    color: 'popover-bg bg-happy-fisher text-dark',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Happy Itmeo',
                    color: 'popover-bg bg-happy-itmeo',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Mixed Hopes',
                    color: 'popover-bg bg-mixed-hopes',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Strong Bliss',
                    color: 'popover-bg bg-strong-bliss',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Grow-Early',
                    color: 'popover-bg bg-grow-early',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Love Kiss',
                    color: 'popover-bg bg-love-kiss',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Premium Dark',
                    color: 'popover-bg bg-premium-dark',
                    btn: 'secondary',
                },
                {
                    placement: 'bottom',
                    text: 'Happy Green',
                    color: 'popover-bg bg-happy-green',
                    btn: 'secondary',
                },
            ]
        };
    }

    render() {
        return (
            <Fragment>
                <div className="text-center">
                    {this.state.popovers.map((popover, i) => {
                        return <PopoverItem key={i} item={popover} id={i}/>;
                    })}
                </div>
            </Fragment>
        );
    }
}

export default PopoversGradientsExample;
