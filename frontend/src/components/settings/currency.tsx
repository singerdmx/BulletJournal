import React from 'react';
import { Select, Icon } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { IState } from '../../store';
import {
  updateExpandedMyself,
  patchMyself
} from '../../features/myself/actions';
import { updateCurrency } from './actions';
import 'flag-icon-css/css/flag-icon.css'; //flag icon
var LocaleCurrency = require('locale-currency'); //currency code
var cc = require('country-code'); //contry alpha2 code
const { Option } = Select;

const alpha2ToName = new Map();
const nameToAlpha2 = new Map();
_.map(cc.countries, country => {
  alpha2ToName.set(country.alpha2, country.name);
});
_.map(cc.countries, country => {
  nameToAlpha2.set(country.name, country.alpha2);
});

type CurrencyProps = {
  originalCurrency: string;
  currentCurrency: string;
  updateExpandedMyself: (updateSettings: boolean) => void;
  updateCurrency: (currency: string) => void;
  patchMyself: (timezone?: string, before?: number, currency?: string) => void;
};

class CurrencyPicker extends React.Component<CurrencyProps> {
  handleOnChange = (value: any) => {
    const str = value as string;
    const name = str.substring(0, str.length - 3);
    const alpha2 = nameToAlpha2.get(name);
    this.props.updateCurrency(alpha2);
  };

  handleOnClick = (save: boolean) => {
    if (save) {
      this.props.patchMyself(undefined, undefined, this.props.currentCurrency);
    } else {
      this.props.updateCurrency(this.props.originalCurrency);
    }
  };

  render() {
    let optionCountries = _.filter(
      cc.countries,
      country => !!LocaleCurrency.getCurrency(country.alpha2)
    );
    //initialize currency data
    let alpha2 = this.props.currentCurrency;
    let name = alpha2ToName.get(alpha2);

    return (
      <span>
        <Select
          showSearch={true}
          style={{ width: 300 }}
          placeholder='Select a currency'
          onChange={this.handleOnChange}
          value={
            <span>
              <span
                style={{ width: '20px' }}
                className={`flag-icon flag-icon-${alpha2.toLowerCase()}`}
              ></span>
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {name}
              </span>
              <span>
                &nbsp;&nbsp; ({LocaleCurrency.getCurrency(alpha2.toLowerCase())}
                )
              </span>
            </span>
          }
        >
          {_.map(optionCountries, country => (
            <Option
              title={
                country.name +
                ' (' +
                LocaleCurrency.getCurrency(country.alpha2.toLowerCase()) +
                ')'
              }
              key={country.name}
              value={
                country.name +
                LocaleCurrency.getCurrency(country.alpha2.toLowerCase())
              }
            >
              <span>
                <span
                  style={{ width: '20px' }}
                  className={`flag-icon flag-icon-${country.alpha2.toLowerCase()}`}
                ></span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{country.name}</span>
                <span>
                  &nbsp;&nbsp; (
                  {LocaleCurrency.getCurrency(country.alpha2.toLowerCase())})
                </span>
              </span>
            </Option>
          ))}
        </Select>
        <Icon
          type='check-circle'
          onClick={() => this.handleOnClick(true)}
          style={{
            marginLeft: '20px',
            cursor: 'pointer',
            color: '#00e600',
            fontSize: 20,
            visibility:
              this.props.currentCurrency !== this.props.originalCurrency
                ? 'visible'
                : 'hidden'
          }}
          title='Save'
        />
        <Icon
          type='close-circle'
          onClick={() => this.handleOnClick(false)}
          style={{
            marginLeft: '20px',
            cursor: 'pointer',
            color: '#ff0000',
            fontSize: 20,
            visibility:
              this.props.currentCurrency !== this.props.originalCurrency
                ? 'visible'
                : 'hidden'
          }}
          title='Cancel'
        />
      </span>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  originalCurrency: state.myself.currency,
  currentCurrency: state.settings.currency
});

export default connect(mapStateToProps, {
  patchMyself,
  updateExpandedMyself,
  updateCurrency
})(CurrencyPicker);
