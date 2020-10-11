import React, {useEffect} from "react";
import TaskDetailPage from "./task-detail.pages";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getSampleTask} from "../../features/tasks/actions";
import {useParams} from "react-router-dom";
import {Task} from "../../features/tasks/interface";
import {Content} from "../../features/myBuJo/interface";
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {EditOutlined} from "@ant-design/icons";
import {setDisplayMore, setDisplayRevision} from "../../features/content/actions";
import './task-page.styles.less';

interface SampleTaskProps {
    task: Task | undefined;
    theme: string;
    contents: Content[];
    getSampleTask: (taskId: number) => void;
    setDisplayMore: (displayMore: boolean) => void;
    setDisplayRevision: (displayRevision: boolean) => void;
}

const SampleTaskPage: React.FC<SampleTaskProps> = (
    {task, contents, getSampleTask, setDisplayMore, setDisplayRevision}
) => {
    // get id of task from router
    const {taskId} = useParams();

    // listening on the empty state working as componentDidmount
    useEffect(() => {
        taskId && getSampleTask(parseInt(taskId));
        setDisplayMore(false);
        setDisplayRevision(false);
    }, [taskId]);

    const handleEdit = () => {
        setDisplayMore(true);
    };

    const createContentElem = (
        <Container>
            {<FloatButton
                tooltip="Edit Content"
                onClick={handleEdit}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
            >
                <EditOutlined/>
            </FloatButton>}
        </Container>

    );

    return (
        <TaskDetailPage
            task={task}
            labelEditable={false}
            taskOperation={() => {
                return <span/>
            }}
            contents={contents}
            createContentElem={createContentElem}
            taskEditorElem={null}
        />
    );
}

const mapStateToProps = (state: IState) => ({
    task: state.task.task,
    contents: state.task.contents,
    content: state.content.content,
    myself: state.myself.username,
    project: state.project.project
});

export default connect(mapStateToProps, {
    getSampleTask,
    setDisplayMore,
    setDisplayRevision
})(SampleTaskPage);