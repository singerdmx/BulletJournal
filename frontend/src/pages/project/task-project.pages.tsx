import React from 'react';
import { List, Divider } from 'antd';
import { Task } from '../../features/tasks/interface';
import TaskItem from '../../components/project-item/task-item.component'
import { connect } from 'react-redux';
import { IState } from '../../store';

type TasksProps = {
    tasks: Task[];
    completedTasks: Task[];
};

const TaskProject: React.FC<TasksProps> = props => {
    const { tasks, completedTasks } = props;

    return (
        <div>
            <List>
                {tasks.map(task => {
                    return (<List.Item key={task.id}>
                        <TaskItem task={task} isComplete={false} />
                    </List.Item>);
                })}
            </List>
            <Divider />
            <List>
                {completedTasks.map(task => {
                    return (<List.Item key={task.id}>
                        <TaskItem task={task} isComplete={true} />
                    </List.Item>);
                })}
            </List>
        </div>

    );
};

const mapStateToProps = (state: IState) => ({
    tasks: state.task.tasks,
    completedTasks: state.task.completedTasks
});

export default connect(mapStateToProps, {
})(TaskProject);