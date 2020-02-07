import React from 'react';
import { Button, Tooltip} from 'reactstrap';

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
      <span>
        <Button className="mr-2 mb-2" color="primary" id={'Tooltip-' + this.props.id}>
          {this.props.item.text}
        </Button>
        <Tooltip placement={this.props.item.placement} isOpen={this.state.tooltipOpen} target={'Tooltip-' + this.props.id} toggle={this.toggle}>
          Tooltip Content!
        </Tooltip>
      </span>
    );
  }
}

class TooltipExampleDark extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltips: [
          {
              placement: 'auto',
              text: 'auto'
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
      <div className="text-center">
        { this.state.tooltips.map((tooltip, i) => {
          return <TooltipItem key={i} item={tooltip} id={i} />;
        })}
      </div>
    );
  }
}

export default TooltipExampleDark;
