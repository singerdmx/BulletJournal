import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import JwPagination from 'jw-react-pagination';

import {
    Row, Col,
    Card, CardBody,
    CardTitle, ListGroupItem, ListGroup
} from 'reactstrap';


import {
    faAngleLeft,
    faAngleRight,
    faAngleDoubleLeft,
    faAngleDoubleRight,

} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const customLabels = {
    first: <FontAwesomeIcon icon={faAngleDoubleLeft}/>,
    last: <FontAwesomeIcon icon={faAngleDoubleRight}/>,
    previous: <FontAwesomeIcon icon={faAngleLeft}/>,
    next: <FontAwesomeIcon icon={faAngleRight}/>
}

class DynamicPagination extends Component {

    constructor() {
        super();

        // an example array of items to be paged
        var exampleItems = [...Array(150).keys()].map(i => ({id: (i + 1), name: 'Item ' + (i + 1)}));

        // bind the onChangePage method to this React component
        this.onChangePage = this.onChangePage.bind(this);

        // store example items and current page of items in local state
        this.state = {
            exampleItems,
            pageOfItems: []
        };
    }

    onChangePage(pageOfItems) {
        // update local state with new page of items
        this.setState({pageOfItems});
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
                                    <CardTitle>Basic</CardTitle>
                                    <JwPagination disableDefaultStyles={true} items={this.state.exampleItems}
                                                  onChangePage={this.onChangePage}/>

                                    <ListGroup className="mt-3">
                                        {this.state.pageOfItems.map(item =>
                                            <ListGroupItem key={item.id}
                                                           className="text-center">{item.name}</ListGroupItem>
                                        )}
                                    </ListGroup>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Custom Icons</CardTitle>
                                    <JwPagination pageSize={5} items={this.state.exampleItems} onChangePage={this.onChangePage}
                                                  labels={customLabels}/>

                                    <ListGroup className="mt-3">
                                        {this.state.pageOfItems.map(item =>
                                            <ListGroupItem key={item.id}
                                                           className="text-center">{item.name}</ListGroupItem>
                                        )}
                                    </ListGroup>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
            ;
    };

}

export default DynamicPagination;
