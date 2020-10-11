// a editor component for taking and update note
import React, {useEffect, useRef, useState} from 'react';
import {Button, message} from 'antd';
import {connect} from 'react-redux';
import ReactQuill from 'react-quill';
import Quill, {DeltaStatic} from 'quill';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';
import {formats, modules} from './content-editor-toolbar';
import {createContent as createNoteContent, patchContent as patchNoteContent,} from '../../features/notes/actions';
import {
    createContent as createTaskContent,
    patchContent as patchTaskContent,
    patchSampleTaskContent
} from '../../features/tasks/actions';
import {
    createContent as createTransactionContent,
    patchContent as patchTransactionContent,
} from '../../features/transactions/actions';
import {ContentType} from '../../features/myBuJo/constants';
import placeholder from '../../assets/placeholder.png';
import axios from 'axios';
import './content-editor.style.less';
import {Content} from "../../features/myBuJo/interface";
import {IState} from "../../store";

const Delta = Quill.import('delta');

type ContentEditorProps = {
    projectItemId: number;
    delta?: DeltaStatic;
    content?: Content;
    contentType: ContentType;
    isOpen: boolean;
};

interface ContentEditorHandler {
    createNoteContent: (noteId: number, text: string) => void;
    patchNoteContent: (
        noteId: number,
        contentId: number,
        text: string,
        diff: string
    ) => void;
    createTaskContent: (taskId: number, text: string) => void;
    patchTaskContent: (
        taskId: number,
        contentId: number,
        text: string,
        diff: string
    ) => void;
    patchSampleTaskContent: (
        taskId: number,
        contentId: number,
        text: string,
        diff: string
    ) => void;
    createTransactionContent: (transactionId: number, text: string) => void;
    patchTransactionContent: (
        transactionId: number,
        contentId: number,
        text: string,
        diff: string
    ) => void;
    afterFinish: Function;
}

const ContentEditor: React.FC<ContentEditorProps & ContentEditorHandler> = (
    {
        projectItemId,
        content,
        delta,
        createNoteContent,
        patchNoteContent,
        afterFinish,
        contentType,
        isOpen,
        createTaskContent,
        createTransactionContent,
        patchTransactionContent,
        patchTaskContent,
        patchSampleTaskContent
    }) => {
    const isEdit = !!delta;
    const [editorContent, setEditorContent] = useState(
        delta ? {delta: delta, '###html###': ''} : {delta: {}, '###html###': ''}
    );
    const quillRef = useRef<ReactQuill>(null);
    const [error, setError] = useState('');

    const oldContents = delta;

    useEffect(() => {
        if (error.length < 1) return;
        message.error(error);
        return () => {
            setError('');
        };
    }, [error]);

    const apiPostNewsImage = (formData: FormData) => {
        const uploadConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        return axios.post('/api/uploadFile', formData, uploadConfig);
    };
    const imageUploader = () => {
        if (!quillRef) return;
        const editor = quillRef.current!.getEditor();
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        console.log('start upload');
        input.onchange = async () => {
            const file = input.files![0];
            const formData = new FormData();
            if (file.size > 20 * 1024 * 1024) {
                setError('The file can not be larger than 20MB');
                return;
            }

            if (!file.type.match('image.*')) {
                setError('The file can only be image');
                return;
            }

            formData.append('file', file);
            // Save current cursor state
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, 'image', `${placeholder}`);
            try {
                const res = await apiPostNewsImage(formData); // API post, returns image location as string e.g. 'http://www.example.com/images/foo.png'
                console.log("apiPostNewsImage", res)
                editor.deleteText(range.index, 1);
                const link = res.data;
                editor.insertEmbed(range.index, 'image', link);
                editor.setSelection(range.index + 1, 0);
            } catch (e) {
                console.log(e.response.data.message);
                setError(e.response.data.message);
            }
        };
    };
    modules.toolbar.handlers = {image: imageUploader};

    /**
     * Do something to our dropped or pasted image
     * @param.imageDataUrl {string} - image's dataURL
     * @param.type {string} - image's mime type
     * @param.imageData {object} - provided more functions to handle the image
     *   - imageData.toBlob() {function} - convert image to a BLOB Object
     *   - imageData.toFile(filename) {function} - convert image to a File Object
     *   - imageData.minify(options) {function)- minify the image, return a promise
     *      - options.maxWidth {number} - specify the max width of the image, default is 800
     *      - options.maxHeight {number} - specify the max height of the image, default is 800
     *      - options.quality {number} - specify the quality of the image, default is 0.8
     */
    const imageDropAndPasteHandler = (imageDataUrl: string, type: string, imageData: any) => {
        if (!quillRef) return;
        const editor = quillRef.current!.getEditor();
        let extension = 'png';
        if (type.startsWith('image/')) {
            extension = type.substring(6);
        }
        const filename = `copied_image.${extension}`;
        const file = imageData.toFile(filename)

        if (file.size > 20 * 1024 * 1024) {
            setError('The file can not be larger than 20MB');
            return;
        }

        // generate a form data
        const formData = new FormData()

        // or just append the file
        formData.append('file', file);

        // Save current cursor state
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'image', `${placeholder}`);
        try {
            apiPostNewsImage(formData).then(res => {
                // API post, returns image location as string e.g. 'http://www.example.com/images/foo.png'
                editor.deleteText(range.index, 1);
                const link = res.data;
                editor.insertEmbed(range.index, 'image', link);
                editor.setSelection(range.index + 1, 0);
            });
        } catch (e) {
            console.log(e.response.data.message);
            setError(e.response.data.message);
        }
    }

    modules.imageDropAndPaste = {handler: imageDropAndPasteHandler};

    //general create content function
    const createContentCall: { [key in ContentType]: Function } = {
        [ContentType.NOTE]: createNoteContent,
        [ContentType.TASK]: createTaskContent,
        [ContentType.TRANSACTION]: createTransactionContent,
        [ContentType.PROJECT]: () => {
        },
        [ContentType.GROUP]: () => {
        },
        [ContentType.LABEL]: () => {
        },
        [ContentType.CONTENT]: () => {
        },
        [ContentType.SAMPLE_TASK]: () => {
        },
    };
    let createContentFunction = createContentCall[contentType];

    //general patch content function
    const patchContentCall: { [key in ContentType]: Function } = {
        [ContentType.NOTE]: patchNoteContent,
        [ContentType.TASK]: patchTaskContent,
        [ContentType.TRANSACTION]: patchTransactionContent,
        [ContentType.PROJECT]: () => {
        },
        [ContentType.GROUP]: () => {
        },
        [ContentType.LABEL]: () => {
        },
        [ContentType.CONTENT]: () => {
        },
        [ContentType.SAMPLE_TASK]: patchSampleTaskContent,
    };
    let patchContentFunction = patchContentCall[contentType];

    const handleFormSubmit = () => {
        if (!isEdit) {
            createContentFunction(
                projectItemId,
                JSON.stringify(editorContent));
        } else if (content) {
            const newContent = new Delta(editorContent['delta']);
            console.log(oldContents!)
            console.log(newContent)
            const diff = new Delta(oldContents!).diff(newContent);
            console.log(diff)
            patchContentFunction(
                projectItemId,
                content.id,
                JSON.stringify(editorContent),
                JSON.stringify(diff)
            );
        }
        afterFinish();
    };

    const handleChange = (
        content: string,
        delta: any,
        source: any,
        editor: ReactQuill.UnprivilegedEditor
    ) => {
        setEditorContent({
            delta: editor.getContents(),
            '###html###': content,
        });
    };
    return (
        <div className="content-editor">
            {isOpen && (
                <ReactQuill
                    bounds={'.content-editor'}
                    defaultValue={oldContents}
                    ref={quillRef}
                    theme="snow"
                    onChange={handleChange}
                    modules={modules}
                    formats={formats}
                />
            )}
            <Button type="primary" onClick={handleFormSubmit}>
                {isEdit ? 'Update' : 'Create'}
            </Button>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    content: state.content.content
});

export default connect(mapStateToProps, {
    createNoteContent,
    patchNoteContent,
    createTaskContent,
    patchTaskContent,
    createTransactionContent,
    patchTransactionContent,
    patchSampleTaskContent
})(ContentEditor);
