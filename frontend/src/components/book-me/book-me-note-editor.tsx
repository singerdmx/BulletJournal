import React, {useRef} from "react";

import './book-me.styles.less';
import {Tooltip} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import ReactQuill from "react-quill";
import {formats, modules} from "../content-editor/content-editor-toolbar";

type BookMeNoteEditorProps = {
}

const BookMeNoteEditor: React.FC<BookMeNoteEditorProps> = (props) => {
    const quillRef = useRef<ReactQuill>(null);

    return <div className='note-editor'>
        <div className='note-editor-title'>
            Description/Instructions&nbsp;&nbsp;
            <Tooltip
                title="Use this optional field to provide a description of your event">
                                    <span className="question-icon">
                                    <QuestionCircleOutlined/>
                                </span>
            </Tooltip>
        </div>
        <ReactQuill
            bounds={'.note-editor'}
            ref={quillRef}
            theme="snow"
            modules={modules}
            formats={formats}
            style={{height: '70px'}}
        />
    </div>
}

export default BookMeNoteEditor;