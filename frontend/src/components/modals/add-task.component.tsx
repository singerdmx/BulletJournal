import React, {useState} from 'react';
import {Modal, Input, Tooltip, Form} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router';
import { ReminderSetting } from '../../features/tasks/interface';
import {createTask} from '../../features/tasks/actions';
import {IState} from '../../store';
import './modals.styles.less';

type TaskProps = {
    projectId: number;
};

interface TaskCreateFormProps {
    createTask: (projectId: number, name: string, assignedTo: string,
                 dueDate: string, dueTime: string, duration: number, reminderSetting: ReminderSetting) => void;
};

const AddTask: React.FC<RouteComponentProps & TaskProps & TaskCreateFormProps> = (props) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const addTask = (values: any) => {
        // props.createTask(props.projectId, values.taskName);
        setVisible(false);
    };
    const onCancel = () => setVisible(false);
    const openModal = () => setVisible(true);
    return (
        <Tooltip placement="top" title='Create New Task'>
            <div className="add-task">
                <PlusOutlined style={{fontSize: 20, cursor: 'pointer'}} onClick={openModal} title='Create New Task'/>
                <Modal
                    title="Create New Task"
                    visible={visible}
                    okText="Create"
                    onCancel={onCancel}
                    onOk={() => {
                        form
                            .validateFields()
                            .then(values => {
                                console.log(values);
                                form.resetFields();
                                addTask(values);
                            })
                            .catch(info => console.log(info));
                    }}
                >
                    <Form form={form}>
                        <Form.Item
                            name="taskName"
                            rules={[
                                {required: true, message: 'Missing Task Name!'}
                            ]}
                        >
                            <Input placeholder="Enter Task Name" allowClear/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Tooltip>
    );
};

const mapStateToProps = (state: IState) => ({
    projectId: state.project.project.id
});

export default connect(mapStateToProps, {createTask})(withRouter(AddTask));