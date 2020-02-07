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
                <div className={this.props.item.class} id={'Tooltip-' + this.props.id}/>
                <Tooltip isOpen={this.state.tooltipOpen} target={'Tooltip-' + this.props.id} toggle={this.toggle}>
                    {this.props.item.text}
                </Tooltip>
            </Fragment>
        );
    }
}

// Gradients

class ColorGradients extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltips: [
                {
                    text: 'Happy Green',
                    class: 'swatch-holder swatch-holder-lg bg-happy-green'
                },
                {
                    text: 'Premium Dark',
                    class: 'swatch-holder swatch-holder-lg bg-premium-dark'
                },
                {
                    text: 'Love Kiss',
                    class: 'swatch-holder swatch-holder-lg bg-love-kiss'
                },
                {
                    text: 'Grow Early',
                    class: 'swatch-holder swatch-holder-lg bg-grow-early'
                },
                {
                    text: 'Strong Bliss',
                    class: 'swatch-holder swatch-holder-lg bg-strong-bliss'
                },
                {
                    text: 'Warm Flame',
                    class: 'swatch-holder swatch-holder-lg bg-warm-flame'
                },
                {
                    text: 'Tempting Azure',
                    class: 'swatch-holder swatch-holder-lg bg-tempting-azure'
                },
                {
                    text: 'Sunny Morning',
                    class: 'swatch-holder swatch-holder-lg bg-sunny-morning'
                },
                {
                    text: 'Mean Fruit',
                    class: 'swatch-holder swatch-holder-lg bg-mean-fruit'
                },
                {
                    text: 'Night Fade',
                    class: 'swatch-holder swatch-holder-lg bg-night-fade'
                },
                {
                    text: 'Heavy Rain',
                    class: 'swatch-holder swatch-holder-lg bg-heavy-rain'
                },
                {
                    text: 'Amy Crisp',
                    class: 'swatch-holder swatch-holder-lg bg-amy-crisp'
                },
                {
                    text: 'Malibu Beach',
                    class: 'swatch-holder swatch-holder-lg bg-malibu-beach'
                },
                {
                    text: 'Deep Blue',
                    class: 'swatch-holder swatch-holder-lg bg-deep-blue'
                },
                {
                    text: 'Mixed Hopes',
                    class: 'swatch-holder swatch-holder-lg bg-mixed-hopes'
                },
                {
                    text: 'Happy Itmeo',
                    class: 'swatch-holder swatch-holder-lg bg-happy-itmeo'
                },
                {
                    text: 'Happy Fisher',
                    class: 'swatch-holder swatch-holder-lg bg-happy-fisher'
                },
                {
                    text: 'Arielle Smile',
                    class: 'swatch-holder swatch-holder-lg bg-arielle-smile'
                },
                {
                    text: 'Ripe Malin',
                    class: 'swatch-holder swatch-holder-lg bg-ripe-malin'
                },
                {
                    text: 'Vicious Stance',
                    class: 'swatch-holder swatch-holder-lg bg-vicious-stance'
                },
                {
                    text: 'Midnight Bloom',
                    class: 'swatch-holder swatch-holder-lg bg-midnight-bloom'
                },
                {
                    text: 'Night Sky',
                    class: 'swatch-holder swatch-holder-lg bg-night-sky'
                },
                {
                    text: 'Slick Carbon',
                    class: 'swatch-holder swatch-holder-lg bg-slick-carbon'
                },
                {
                    text: 'Royal',
                    class: 'swatch-holder swatch-holder-lg bg-royal'
                },
                {
                    text: 'Asteroid',
                    class: 'swatch-holder swatch-holder-lg bg-asteroid'
                }
            ]
        }

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

export default ColorGradients;
