import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

export default class ListGroupFlush extends React.Component {
  render() {
    return (
      <ListGroup flush>
        <ListGroupItem disabled tag="a" href="javascript:void(0);">Cras justo odio</ListGroupItem>
        <ListGroupItem tag="a" href="javascript:void(0);">Dapibus ac facilisis in</ListGroupItem>
        <ListGroupItem tag="a" href="javascript:void(0);">Morbi leo risus</ListGroupItem>
        <ListGroupItem tag="a" href="javascript:void(0);">Porta ac consectetur ac</ListGroupItem>
        <ListGroupItem tag="a" href="javascript:void(0);">Vestibulum at eros</ListGroupItem>
      </ListGroup>
    );
  }
}
