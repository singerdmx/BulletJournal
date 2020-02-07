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
                <Button className="mr-2 mb-2" color="primary" id={'Popover-' + this.props.id} onClick={this.toggle}>
                    {this.props.item.text}
                </Button>
                <Popover placement={this.props.item.placement} isOpen={this.state.popoverOpen}
                         target={'Popover-' + this.props.id} toggle={this.toggle}>
          <PopoverHeader>Popover Title</PopoverHeader>
            <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
        </Popover>
      </span>
        );
    }
}

class PopoversBasicExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popovers: [
                {
                    placement: 'auto',
                    text: 'auto',
                },
                {
                    placement: 'auto-start',
                    text: 'auto-start'
                },
                {
                    placement: 'auto-end',
                    text: 'auto-end'
                },
                {
                    placement: 'top',
                    text: 'top'
                },
                {
                    placement: 'top-start',
                    text: 'top-start'
                },
                {
                    placement: 'top-end',
                    text: 'top-end'
                },
                {
                    placement: 'right',
                    text: 'right'
                },
                {
                    placement: 'right-start',
                    text: 'right-start'
                },
                {
                    placement: 'right-end',
                    text: 'right-end'
                },
                {
                    placement: 'bottom',
                    text: 'bottom'
                },
                {
                    placement: 'bottom-start',
                    text: 'bottom-start'
                },
                {
                    placement: 'bottom-end',
                    text: 'bottom-end'
                },
                {
                    placement: 'left',
                    text: 'left'
                },
                {
                    placement: 'left-start',
                    text: 'left-start'
                },
                {
                    placement: 'left-end',
                    text: 'left-end'
                },
            ]
        };
    }

    render() {
        return (
            <Fragment>
                <div className="text-center">
                    {this.state.popovers.map((popover, i) => {
                        return (
                            <PopoverItem key={i} item={popover} id={i}/>
                        );
                    })}
                </div>
            </Fragment>
        );
    }
}

export default PopoversBasicExample;
