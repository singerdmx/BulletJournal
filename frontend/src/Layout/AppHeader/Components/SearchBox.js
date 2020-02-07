import React, { Fragment } from "react";

import cx from "classnames";

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSearch: false
    };
  }

  render() {
    return (
      <Fragment>
        <div
          className={cx("search-wrapper", {
            active: this.state.activeSearch
          })}
        >
          <div className="input-holder">
            <input type="text" className="search-input" />
            <button
              onClick={() =>
                this.setState({ activeSearch: !this.state.activeSearch })
              }
              className="search-icon"
            >
              <span />
            </button>
          </div>
          <button
            onClick={() =>
              this.setState({ activeSearch: !this.state.activeSearch })
            }
            className="close"
          />
        </div>
      </Fragment>
    );
  }
}

export default SearchBox;
