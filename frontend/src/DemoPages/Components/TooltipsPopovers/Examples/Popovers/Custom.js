import React, {Fragment} from 'react';
import cx from 'classnames';

import {
    Button,
    Nav,
    NavItem,
    NavLink,
    Popover, PopoverBody
} from 'reactstrap';

import bg1 from '../../../../../assets/utils/images/dropdown-header/abstract1.jpg';


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
                <Button className="mr-2 mb-2" color={this.props.item.btn} id={'PopoverCustom-' + this.props.id}
                        onClick={this.toggle}>
                    {this.props.item.text}
                </Button>
                <Popover className="popover-custom" placement={this.props.item.placement}
                         isOpen={this.state.popoverOpen}
                         target={'PopoverCustom-' + this.props.id} toggle={this.toggle}>
            <PopoverBody>
                <Nav vertical>
                    <NavItem className="nav-item-header">
                        Activity
                    </NavItem>
                    <NavItem>
                        <NavLink href="javascript:void(0);">
                            Chat
                            <div className="ml-auto badge badge-pill badge-info">8</div>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="javascript:void(0);">Recover Password</NavLink>
                    </NavItem>
                    <NavItem className="nav-item-divider"/>
                    <NavItem className="nav-item-btn">
                        <Button size="sm" className="btn-wide btn-shadow" color="danger">
                            Cancel
                        </Button>
                    </NavItem>
                </Nav>
            </PopoverBody>
        </Popover>
      </span>
        );
    }
}

class PopoversCustomExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popovers: [
                {
                    placement: 'bottom',
                    text: 'Primary',
                    color: 'popover-bg bg-primary',
                    btn: 'primary'
                },
                {
                    placement: 'bottom',
                    text: 'Secondary',
                    color: 'popover-bg bg-secondary',
                    btn: 'secondary'
                },
                {
                    placement: 'bottom',
                    text: 'Success',
                    color: 'popover-bg bg-success',
                    btn: 'success'
                },
                {
                    placement: 'bottom',
                    text: 'Info',
                    color: 'popover-bg bg-info',
                    btn: 'info'
                },
                {
                    placement: 'bottom',
                    text: 'Warning',
                    color: 'popover-bg bg-warning text-dark',
                    btn: 'warning '
                },
                {
                    placement: 'bottom',
                    text: 'Danger',
                    color: 'popover-bg bg-danger',
                    btn: 'danger'
                },
                {
                    placement: 'bottom',
                    text: 'Focus',
                    color: 'popover-bg bg-focus',
                    btn: 'focus'
                },
                {
                    placement: 'bottom',
                    text: 'Alternate',
                    color: 'popover-bg bg-alternate',
                    btn: 'alternate'
                },
                {
                    placement: 'bottom',
                    text: 'Light',
                    color: 'popover-bg bg-light text-dark',
                    btn: 'light'
                },
                {
                    placement: 'bottom',
                    text: 'Dark',
                    color: 'popover-bg bg-dark',
                    btn: 'dark'
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

export default PopoversCustomExample;
