import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {InputGroupButtonDropdown, InputGroup, Input, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

const propTypes = {
    addonType: PropTypes.oneOf(['prepend', 'append']).isRequired,
};

class FormInputGroupButtonDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {

        return (
            <Fragment>
                <InputGroup>
                    <InputGroupButtonDropdown addonType="prepend" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret>
                            Button Dropdown
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>Header</DropdownItem>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem divider/>
                            <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                    </InputGroupButtonDropdown>
                    <Input/>
                </InputGroup>
            </Fragment>
        );
    }
}

FormInputGroupButtonDropdown.propTypes = propTypes;

export default FormInputGroupButtonDropdown;
