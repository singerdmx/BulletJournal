import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col,
    Card, CardBody, Button,
    CardTitle, CardFooter
} from 'reactstrap';

import {
    ToastContainer,
    toast,
    Bounce,
    Slide,
    Flip,
    Zoom
} from 'react-toastify';

const flags = [
    {
        id: 'disableAutoClose',
        label: 'Disable auto-close'
    },
    {
        id: 'hideProgressBar',
        label: 'Hide progress bar(less fanciness!)'
    },
    {
        id: 'newestOnTop',
        label: 'Newest on top*'
    },
    {
        id: 'closeOnClick',
        label: 'Close on click'
    },
    {
        id: 'pauseOnHover',
        label: 'Pause delay on hover'
    },
    {
        id: 'pauseOnFocusLoss',
        label: 'Pause toast when the window loses focus'
    },
    {
        id: 'rtl',
        label: 'Right to left layout*'
    },
    {
        id: 'draggable',
        label: 'Allow to drag and close the toast'
    }
];

const transitions = {
    bounce: Bounce,
    slide: Slide,
    zoom: Zoom,
    flip: Flip
};

const Checkbox = ({label, onChange, id, checked}) => (
    <div className="form-check">
        <input
            id={id}
            className="form-check-input"
            type="checkbox"
            name={id}
            checked={checked}
            onChange={onChange}
        />
        <label className="form-check-label" htmlFor={id}>
            {label}
        </label>
    </div>
);

const Radio = ({options, name, onChange, checked = false}) => {
    return Object.keys(options).map(k => {
        const option = options[k];

        return (
            <div className="form-check" key={`${name}-${option}`}>
                <input
                    className="form-check-input"
                    id={option}
                    type="radio"
                    name={name}
                    value={option}
                    checked={option === checked}
                    onChange={onChange}
                />
                <label className="form-check-label" htmlFor={option}>
                    {option}
                </label>
            </div>
        );
    });
};

function getType(type) {
    switch (type) {
        case 'default':
        default:
            return 'toast';
        case 'success':
            return 'toast.success';
        case 'error':
            return 'toast.error';
        case 'info':
            return 'toast.info';
        case 'warning':
            return 'toast.warn';
    }
}

class ToastifyAlerts extends Component {
    state = ToastifyAlerts.getDefaultState();

    static getDefaultState() {
        return {
            ...ToastContainer.defaultProps,
            transition: 'bounce',
            type: 'success',
            disableAutoClose: false
        };
    }

    handleReset = () =>
        this.setState({
            ...ToastifyAlerts.getDefaultState()
        });

    clearAll = () => toast.dismiss();

    showToast = () =>
        this.state.type === 'default'
            ? toast('This is the default toaster notification box!')
            : toast[this.state.type]('This is a toaster screen notification with dummy color, position and extra texts!');

    handleAutoCloseDelay = e =>
        this.setState({
            autoClose: e.target.value > 0 ? parseInt(e.target.value, 10) : 1
        });

    isDefaultProps() {
        return (
            this.state.position === 'top-right' &&
            (this.state.autoClose === 5000 && !this.state.disableAutoClose) &&
            !this.state.hideProgressBar &&
            !this.state.newestOnTop &&
            !this.state.rtl &&
            this.state.pauseOnFocusLoss &&
            this.state.pauseOnHover &&
            this.state.closeOnClick &&
            this.state.draggable
        );
    }

    handleRadioOrSelect = e =>
        this.setState({
            [e.target.name]: e.target.value
        });

    toggleCheckbox = e =>
        this.setState({
            [e.target.name]: !this.state[e.target.name]
        });

    renderFlags() {
        return flags.map(({id, label}) => (
            <div key={id}>
                <Checkbox
                    id={id}
                    className="form-check-input"
                    label={label}
                    onChange={this.toggleCheckbox}
                    checked={this.state[id]}
                />
            </div>
        ));
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
                        <Col md="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Toastify Configurator</CardTitle>
                                    <Row>
                                        <Col md="2">
                                            <div>
                                                <h5>Color States</h5>
                                                <div>
                                                    <Radio
                                                        options={toast.TYPE}
                                                        name="type"
                                                        checked={this.state.type}
                                                        onChange={this.handleRadioOrSelect}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <h5>Options</h5>
                                            <div>{this.renderFlags()}</div>
                                        </Col>
                                        <Col md="3">
                                            <div>
                                                <h5>Animation</h5>
                                                <div>
                                                    <div className="form-group">
                                                        <label htmlFor="transition">Transition</label>
                                                        <select
                                                            name="transition"
                                                            id="transition"
                                                            className="form-control"
                                                            onChange={this.handleRadioOrSelect}
                                                            value={this.state.transition}
                                                        >
                                                            {Object.keys(transitions).map(k => (
                                                                <option key={k} value={k}>
                                                                    {k}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="autoClose">Delay</label>
                                                        <input
                                                            type="number"
                                                            name="autoClose"
                                                            className="form-control"
                                                            id="autoClose"
                                                            value={this.state.autoClose}
                                                            onChange={this.handleAutoCloseDelay}
                                                            disabled={this.state.disableAutoClose}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <div>
                                        <Button size="sm" className="text-danger" onClick={this.clearAll} color="link">Clear
                                            All</Button>
                                        <Button size="sm" className="text-primary" onClick={this.handleReset}
                                                color="link">Reset</Button>
                                    </div>
                                    <div className="ml-auto">
                                        <Button size="lg" color="success" onClick={this.showToast}>Show Toast</Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>

                </ReactCSSTransitionGroup>

            </Fragment>
        );
    }
}

export default ToastifyAlerts;