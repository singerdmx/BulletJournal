import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import FormsCustomControls from './CustomControls';

import {
    Button, Form,
    FormGroup, Label,
    Input, FormText,
    Row, Col,
    Card, CardBody,
    CardTitle,
} from 'reactstrap';

export default class FormsDefault extends React.Component {
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
                    <div>
                        <Row>
                        <Col md="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Controls Types</CardTitle>
                                    <Form>
                                        <FormGroup>
                                            <Label for="exampleEmail">Email</Label>
                                            <Input type="email" name="email" id="exampleEmail"
                                                   placeholder="with a placeholder"/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="examplePassword">Password</Label>
                                            <Input type="password" name="password" id="examplePassword"
                                                   placeholder="password placeholder"/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="exampleSelect">Select</Label>
                                            <Input type="select" name="select" id="exampleSelect">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="exampleSelectMulti">Select Multiple</Label>
                                            <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="exampleText">Text Area</Label>
                                            <Input type="textarea" name="text" id="exampleText"/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="exampleFile">File</Label>
                                            <Input type="file" name="file" id="exampleFile"/>
                                            <FormText color="muted">
                                                This is some placeholder block-level help text for the above input.
                                                It's a bit lighter and easily wraps to a new line.
                                            </FormText>
                                        </FormGroup>
                                        <Button color="primary" className="mt-1">Submit</Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Sizing</CardTitle>
                                    <Form>
                                        <Input className="mb-2" placeholder="lg" bsSize="lg"/>
                                        <Input className="mb-2" placeholder="default"/>
                                        <Input className="mb-2" placeholder="sm" bsSize="sm"/>
                                        <div className="divider"/>
                                        <Input className="mb-2" type="select" bsSize="lg">
                                            <option>Large Select</option>
                                        </Input>
                                        <Input className="mb-2" type="select">
                                            <option>Default Select</option>
                                        </Input>
                                        <Input type="select" bsSize="sm">
                                            <option>Small Select</option>
                                        </Input>
                                    </Form>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Checkboxes & Radios</CardTitle>
                                    <Form>
                                        <FormGroup tag="fieldset">
                                            <FormGroup check>
                                                <Label check>
                                                    <Input type="radio" name="radio1"/>{' '}
                                                    Option one is this and that—be sure to include why it's great
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check>
                                                <Label check>
                                                    <Input type="radio" name="radio1"/>{' '}
                                                    Option two can be something else and selecting it will deselect
                                                    option
                                                    one
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check disabled>
                                                <Label check>
                                                    <Input type="radio" name="radio1" disabled/>{' '}
                                                    Option three is disabled
                                                </Label>
                                            </FormGroup>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Label check>
                                                <Input type="checkbox"/>{' '}
                                                Check me out
                                            </Label>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                        <FormsCustomControls/>
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
