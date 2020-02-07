import React, {Fragment} from 'react';
import {Button, Form, FormGroup, Label, Input} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class FormInline extends React.Component {
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
                    <Form inline>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="exampleEmail22" className="mr-sm-2">Email</Label>
                            <Input type="email" name="email" id="exampleEmail22" placeholder="something@idk.cool"/>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="examplePassword22" className="mr-sm-2">Password</Label>
                            <Input type="password" name="password" id="examplePassword22" placeholder="don't tell!"/>
                        </FormGroup>
                        <Button color="primary">Submit</Button>
                    </Form>
                    <div className="divider"/>
                    <Form>
                        <FormGroup check inline>
                            <Label check>
                                <Input type="checkbox"/> Some input
                            </Label>
                        </FormGroup>
                        <FormGroup check inline>
                            <Label check>
                                <Input type="checkbox"/> Some other input
                            </Label>
                        </FormGroup>
                    </Form>
                    <div className="divider"/>
                    <Form inline>
                        <FormGroup>
                            <Label for="exampleEmail33" hidden>Email</Label>
                            <Input type="email" name="email" className="mr-2" id="exampleEmail33" placeholder="Email"/>
                        </FormGroup>
                        {' '}
                        <FormGroup>
                            <Label for="examplePassword44" hidden>Password</Label>
                            <Input type="password" className="mr-2" name="password" id="examplePassword44"
                                   placeholder="Password"/>
                        </FormGroup>
                        {' '}
                        <Button color="primary">Submit</Button>
                    </Form>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
