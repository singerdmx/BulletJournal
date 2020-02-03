import React from 'react';
import _ from 'lodash';
import axios from 'axios';

class QuestionListPanel extends React.Component {
  state: any = { news: null};
  
  constructor(props: any) {
    super(props);
    this.loadQuestionList = this.loadQuestionList.bind(this);
  }

  componentDidMount() {
    this.loadQuestionList();
    this.loadQuestionList = _.debounce(this.loadQuestionList, 1000);
    setInterval(this.loadQuestionList, 1000);
  }

  loadQuestionList() {
    const config = {
        method: 'get',
        headers: { 'content-type': 'application/json', 'accept': '*/*' },
        url: 'http://localhost/api/questions',
        timeout: 3000
    };
    console.log("fetching ...");
    axios.get(config.url).then(res => {
        const news = res.data.content;
        this.setState({
            news: news,
        })
        
    }).catch(error => {
        console.log(error);
    });
  }

  renderQuestionList() {
    const news_list = this.state.news.map(function(news: any, index: any) {
      return(
        <h5 key={index}>{news.title}</h5>
      );
    });

    return(
      <div className='container-fluid'>
        <div className='list-group'>
          {news_list}
        </div>
      </div>
    )
  }

  render() {
    if (this.state.news) {
      return(
        <div>
          {this.renderQuestionList()}
        </div>
      );
    } else {
      return(
        <div>
          <div id='msg-app-loading'>
            Loading...
          </div>
        </div>
      );
    }
  }
}

export default QuestionListPanel;