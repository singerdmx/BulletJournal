import React from 'react';
import axios from 'axios';

class NewQuestionForm extends React.Component {
  state: any = {value: ''};
    constructor(props: any) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event: any) {
      this.setState({value: event.target.value});
    }
  
    async handleSubmit(event: any) {

      const postBody = {
        description:this.state.value,
        title:this.state.value
      }

      const config = {
        method: 'post',
        headers: { 'content-type': 'application/json', 'accept': '*/*' },
        url: 'http://localhost/api/questions',
        data: postBody,
        timeout: 3000 // timeout in ms
      };

      axios.post(config.url, postBody).then(res => {
        console.log(postBody);
        console.log(res);
      }).catch(error => {
        console.log(postBody);
        console.log(error);
      })

      alert('A question was submitted: ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <div>
        <form onSubmit={this.handleSubmit} >
          <label>
            Questions: 
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        </div>
      );
    };
  }

  export default NewQuestionForm;