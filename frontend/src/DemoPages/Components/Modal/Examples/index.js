import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col,
    Card, CardBody,
    CardTitle, Button, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

import ModalExample from './Modal';
import ModalBackdrop from './ModalBackdrop';
import ModalCustomCloseButton from './ModalCustomCloseButton';
import ModalCustomCloseIcon from './ModalCustomCloseIcon';
import ModalCustomTimeout from './ModalCustomTimeout';
import ModalExternal from './ModalExternal';
import ModalFadeless from './ModalFadeless';
import ModalNested from './ModalNested';

class ModalsExample extends React.Component {
    constructor(props) {
        super(props);

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
                    <Row className="text-center">
                        <Col md="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>
                                        Bootstrap 4 Modals
                                    </CardTitle>
                                    <ModalExample/>
                                    <ModalCustomCloseButton/>
                                    <ModalCustomCloseIcon/>
                                    <ModalCustomTimeout/>
                                    <ModalExternal/>
                                    <ModalFadeless/>
                                    <ModalNested/>
                                    <div className="divider"/>
                                    <ModalBackdrop/>
                                </CardBody>
                            </Card>
                        </Col>

                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}

export default ModalsExample;
