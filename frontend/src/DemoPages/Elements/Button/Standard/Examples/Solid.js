import React, {Component, Fragment} from 'react';
import {Button, ButtonGroup} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';


class ButtonsStandardSolid extends Component {

    state = {
        expLeft: false,
        expRight: false,
        expUp: false,
        expDown: false,
        expContract: false,
        expOverlay: false,
        expSlideLeft: false,
        expSlideRight: false,
        expSlideUp: false,
        expSlideDown: false,
        expZoomIn: false,
        expZoomOut: false,
    }

    constructor(props) {
        super(props);

        this.state = {
            cSelected: [],
        };

        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
        this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
    }

    toggle(name) {
        this.setState({
            [name]: !this.state[name],
            progress: 0.5,
        })
    }

    onRadioBtnClick(rSelected) {
        this.setState({rSelected});
    }

    onCheckboxBtnClick(selected) {
        const index = this.state.cSelected.indexOf(selected);
        if (index < 0) {
            this.state.cSelected.push(selected);
        } else {
            this.state.cSelected.splice(index, 1);
        }
        this.setState({cSelected: [...this.state.cSelected]});
    }

    render() {
        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <Row>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Solid</CardTitle>
                                    <Button className="mb-2 mr-2" color="primary">Primary</Button>
                                    <Button className="mb-2 mr-2" color="secondary">Secondary</Button>
                                    <Button className="mb-2 mr-2" color="success">Success</Button>
                                    <Button className="mb-2 mr-2" color="info">Info</Button>
                                    <Button className="mb-2 mr-2" color="warning">Warning</Button>
                                    <Button className="mb-2 mr-2" color="danger">Danger</Button>
                                    <Button className="mb-2 mr-2" color="focus">Focus</Button>
                                    <Button className="mb-2 mr-2" color="alternate">Alt</Button>
                                    <Button className="mb-2 mr-2" color="light">Light</Button>
                                    <Button className="mb-2 mr-2" color="dark">Dark</Button>
                                    <Button className="mb-2 mr-2" color="link">link</Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Color Transition</CardTitle>
                                    <Button outline className="mb-2 mr-2 btn-transition"
                                            color="primary">Primary</Button>
                                    <Button outline className="mb-2 mr-2 btn-transition"
                                            color="secondary">Secondary</Button>
                                    <Button outline className="mb-2 mr-2 btn-transition"
                                            color="success">Success</Button>
                                    <Button outline className="mb-2 mr-2 btn-transition" color="info">Info</Button>
                                    <Button outline className="mb-2 mr-2 btn-transition"
                                            color="warning">Warning</Button>
                                    <Button outline className="mb-2 mr-2 btn-transition" color="danger">Danger</Button>
                                    <Button outline className="mb-2 mr-2 btn-transition" color="focus">Focus</Button>
                                    <Button outline className="mb-2 mr-2 btn-transition" color="alternate">Alt</Button>
                                    <Button outline className="mb-2 mr-2 btn-transition" color="light">Light</Button>
                                    <Button outline className="mb-2 mr-2 btn-transition" color="dark">Dark</Button>
                                    <Button outline className="mb-2 mr-2 btn-transition" color="link">link</Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Color Transition No Borders</CardTitle>
                                    <Button outline className="mb-2 mr-2 border-0 btn-transition"
                                            color="primary">Primary</Button>
                                    <Button outline className="mb-2 mr-2 border-0 btn-transition" color="secondary">Secondary</Button>
                                    <Button outline className="mb-2 mr-2 border-0 btn-transition"
                                            color="success">Success</Button>
                                    <Button outline className="mb-2 mr-2 border-0 btn-transition"
                                            color="info">Info</Button>
                                    <Button outline className="mb-2 mr-2 border-0 btn-transition"
                                            color="warning">Warning</Button>
                                    <Button outline className="mb-2 mr-2 border-0 btn-transition"
                                            color="danger">Danger</Button>
                                    <Button outline className="mb-2 mr-2 border-0 btn-transition"
                                            color="focus">Focus</Button>
                                    <Button outline className="mb-2 mr-2 border-0 btn-transition"
                                            color="alternate">Alt</Button>
                                    <Button outline className="mb-2 mr-2 border-0 btn-transition"
                                            color="light">Light</Button>
                                    <Button outline className="mb-2 mr-2 border-0 btn-transition"
                                            color="dark">Dark</Button>
                                    <Button outline className="mb-2 mr-2 border-0 btn-transition"
                                            color="link">link</Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Hover Shine</CardTitle>
                                    <Button className="mb-2 mr-2 btn-hover-shine" color="primary">Primary</Button>
                                    <Button className="mb-2 mr-2 btn-hover-shine" color="secondary">Secondary</Button>
                                    <Button className="mb-2 mr-2 btn-hover-shine" color="success">Success</Button>
                                    <Button className="mb-2 mr-2 btn-hover-shine" color="info">Info</Button>
                                    <Button className="mb-2 mr-2 btn-hover-shine" color="warning">Warning</Button>
                                    <Button className="mb-2 mr-2 btn-hover-shine" color="danger">Danger</Button>
                                    <Button className="mb-2 mr-2 btn-hover-shine" color="focus">Focus</Button>
                                    <Button className="mb-2 mr-2 btn-hover-shine" color="alternate">Alt</Button>
                                    <Button className="mb-2 mr-2 btn-hover-shine" color="light">Light</Button>
                                    <Button className="mb-2 mr-2 btn-hover-shine" color="dark">Dark</Button>
                                    <Button className="mb-2 mr-2 btn-hover-shine" color="link">link</Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Active State</CardTitle>
                                    <Button className="mb-2 mr-2" active color="primary">Primary</Button>
                                    <Button className="mb-2 mr-2" active color="secondary">Secondary</Button>
                                    <Button className="mb-2 mr-2" active color="success">Success</Button>
                                    <Button className="mb-2 mr-2" active color="info">Info</Button>
                                    <Button className="mb-2 mr-2" active color="warning">Warning</Button>
                                    <Button className="mb-2 mr-2" active color="danger">Danger</Button>
                                    <Button className="mb-2 mr-2" active color="focus">Focus</Button>
                                    <Button className="mb-2 mr-2" active color="alternate">Alt</Button>
                                    <Button className="mb-2 mr-2" active color="light">Light</Button>
                                    <Button className="mb-2 mr-2" active color="dark">Dark</Button>
                                    <Button className="mb-2 mr-2" active color="link">link</Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Disabled State</CardTitle>
                                    <Button className="mb-2 mr-2" disabled color="primary">Primary</Button>
                                    <Button className="mb-2 mr-2" disabled color="secondary">Secondary</Button>
                                    <Button className="mb-2 mr-2" disabled color="success">Success</Button>
                                    <Button className="mb-2 mr-2" disabled color="info">Info</Button>
                                    <Button className="mb-2 mr-2" disabled color="warning">Warning</Button>
                                    <Button className="mb-2 mr-2" disabled color="danger">Danger</Button>
                                    <Button className="mb-2 mr-2" disabled color="focus">Focus</Button>
                                    <Button className="mb-2 mr-2" disabled color="alternate">Alt</Button>
                                    <Button className="mb-2 mr-2" disabled color="light">Light</Button>
                                    <Button className="mb-2 mr-2" disabled color="dark">Dark</Button>
                                    <Button className="mb-2 mr-2" disabled color="link">link</Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Block Level</CardTitle>
                                    <Button block className="mb-2 mr-2" size="lg" color="primary">Block Large</Button>
                                    <Button block className="mb-2 mr-2" color="primary">Block Normal</Button>
                                    <Button block className="mb-2 mr-2" size="sm" color="primary">Block Small</Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Wider</CardTitle>
                                    <div className="text-center">
                                        <Button className="btn-wide mb-2 mr-2" size="lg" color="primary">Wider
                                            Large</Button>
                                        <Button className="btn-wide mb-2 mr-2" color="primary">Wider Normal</Button>
                                        <Button className="btn-wide mb-2 mr-2" size="sm" color="primary">Wider
                                            Small</Button>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Sizing</CardTitle>
                                    <div className="text-center">
                                        <Button className="mb-2 mr-2" size="lg" color="primary">Large</Button>
                                        <Button className="mb-2 mr-2" color="primary">Normal</Button>
                                        <Button className="mb-2 mr-2" size="sm" color="primary">Small</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Checkbox Buttons</CardTitle>
                                    <div className="text-center">
                                        <ButtonGroup size="sm">
                                            <Button color="primary" onClick={() => this.onCheckboxBtnClick(1)}
                                                    active={this.state.cSelected.includes(1)}>One</Button>
                                            <Button color="primary" onClick={() => this.onCheckboxBtnClick(2)}
                                                    active={this.state.cSelected.includes(2)}>Two</Button>
                                            <Button color="primary" onClick={() => this.onCheckboxBtnClick(3)}
                                                    active={this.state.cSelected.includes(3)}>Three</Button>
                                        </ButtonGroup>
                                        <div className="divider"/>
                                        <ButtonGroup>
                                            <Button color="danger" onClick={() => this.onCheckboxBtnClick(1)}
                                                    active={this.state.cSelected.includes(1)}>One</Button>
                                            <Button color="danger" onClick={() => this.onCheckboxBtnClick(2)}
                                                    active={this.state.cSelected.includes(2)}>Two</Button>
                                            <Button color="danger" onClick={() => this.onCheckboxBtnClick(3)}
                                                    active={this.state.cSelected.includes(3)}>Three</Button>
                                        </ButtonGroup>
                                        <div className="divider"/>
                                        <ButtonGroup size="lg">
                                            <Button color="alternate" onClick={() => this.onCheckboxBtnClick(1)}
                                                    active={this.state.cSelected.includes(1)}>One</Button>
                                            <Button color="alternate" onClick={() => this.onCheckboxBtnClick(2)}
                                                    active={this.state.cSelected.includes(2)}>Two</Button>
                                            <Button color="alternate" onClick={() => this.onCheckboxBtnClick(3)}
                                                    active={this.state.cSelected.includes(3)}>Three</Button>
                                        </ButtonGroup>
                                        <div className="divider"/>
                                        <p>Selected: {JSON.stringify(this.state.cSelected)}</p>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Radio Buttons</CardTitle>
                                    <div className="text-center">
                                        <ButtonGroup size="sm">
                                            <Button color="primary" onClick={() => this.onRadioBtnClick(1)}
                                                    active={this.state.rSelected === 1}>One</Button>
                                            <Button color="primary" onClick={() => this.onRadioBtnClick(2)}
                                                    active={this.state.rSelected === 2}>Two</Button>
                                            <Button color="primary" onClick={() => this.onRadioBtnClick(3)}
                                                    active={this.state.rSelected === 3}>Three</Button>
                                        </ButtonGroup>
                                        <div className="divider"/>
                                        <ButtonGroup>
                                            <Button color="warning" onClick={() => this.onRadioBtnClick(1)}
                                                    active={this.state.rSelected === 1}>One</Button>
                                            <Button color="warning" onClick={() => this.onRadioBtnClick(2)}
                                                    active={this.state.rSelected === 2}>Two</Button>
                                            <Button color="warning" onClick={() => this.onRadioBtnClick(3)}
                                                    active={this.state.rSelected === 3}>Three</Button>
                                        </ButtonGroup>
                                        <div className="divider"/>
                                        <ButtonGroup size="lg">
                                            <Button color="focus" onClick={() => this.onRadioBtnClick(1)}
                                                    active={this.state.rSelected === 1}>One</Button>
                                            <Button color="focus" onClick={() => this.onRadioBtnClick(2)}
                                                    active={this.state.rSelected === 2}>Two</Button>
                                            <Button color="focus" onClick={() => this.onRadioBtnClick(3)}
                                                    active={this.state.rSelected === 3}>Three</Button>
                                        </ButtonGroup>
                                        <div className="divider"/>
                                        <p>Selected: {this.state.rSelected}</p>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
};

export default ButtonsStandardSolid;
