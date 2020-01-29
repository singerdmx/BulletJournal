import React from 'react';
import './App.css';
import NewQuestionForm from './NewQuestionPanel/NewQuestionForm'
import QuestionListPanel from './QuestionListPanel/QuestionsListPanel'

const App: React.FC = () => {
  return (
    <div>
        <div className='container'>
          <NewQuestionForm />
        </div>
        <div className='container'>
          <QuestionListPanel />
        </div>
      </div>
  );
}

export default App;
