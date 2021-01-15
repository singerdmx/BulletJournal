/* eslint-env browser */

import * as Y from 'yjs';
import {QuillBinding} from 'y-quill';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import {WebrtcProvider} from 'y-webrtc';
import hljs from 'highlight.js';
import * as iziToast from 'izitoast'
import css from "./iziToast.min.css";

const Delta = Quill.import('delta');

let userList = {};
let loginCookie = null;
let targetContentId = null;
let projectItem = null;
let uid = null;
let ydocClientID = null;
let Font = Quill.import('formats/font');
Font.whitelist = ["sans-serif", "serif", "monospace"];
let Size = Quill.import('formats/size');
Size.whitelist = ['small',  'large', 'huge'] ;

console.log("---------------import--------");
console.log("import",Quill.imports);

Quill.register('modules/cursors', QuillCursors);
hljs.initHighlightingOnLoad();

function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }

    if (window.location.host === 'localhost') {
        return "BulletJournal##group##sig";
    }
    return "";
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function saveChanges(editor, isAutoSave) {
    if (!loginCookie || !targetContentId || !projectItem) {
        return;
    }
    const newContent = JSON.stringify({
        delta: editor.getContents()
    });
    const patchBody = JSON.stringify({
        text: newContent,
    });
    console.log('Saving content', newContent);
    const url = '/api/' + projectItem['contentType'].toLowerCase() + 's/' + projectItem['id'] + '/contents/' + targetContentId;
    console.log('Updating ' + url);
    const headers = {'Content-Type': 'application/json'};
    fetch(url, {headers: headers, method: 'PATCH', body: patchBody}).then(res => {
        if (res.ok) {
            if (isAutoSave) {
                setTimeout(saveChanges, 60000, editor,true);
            }else{
                showSuccess("Successfully saved the content");
            }
        } else {
            if (res.status === 401) {
                showWarningWithOption(noAccessWarning(projectItem['contentType']));
            }
            console.error('RES:', res);
        }
    });
}

const updateUserList = (map) => {
    const userListDiv = document.getElementById('userList');
    userListDiv.innerHTML = "";

    function addToUserListDiv(value) {
        const div = document.createElement('DIV');
        const span = document.createElement("SPAN");
        span.innerText = value.user.name;
        span.setAttribute("style", "color:" + value.user.color);
        div.appendChild(span);
        userListDiv.appendChild(div);
    }

    addToUserListDiv(map.get(ydocClientID));

    for (const [key, value] of map.entries()) {
        if (key !== ydocClientID) {
            addToUserListDiv(value);
        }
    }
};

const registerShareButton = () => {
    const shareButton = document.getElementById('share-link-button');
    shareButton.onclick = () => {
        const url = window.location.hostname + "/collab/?uid=" + uid;
        navigator.clipboard.writeText(url).then(function () {
            console.log('Async: Copying to clipboard was successful!');
            alert("Link Copied to clipboard: " + url);
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }
};

const registerSaveButton = (editor) => {
    const saveButton = document.getElementById('save-button');
    saveButton.onclick = () => {
        saveChanges(editor,false);
    }
};

window.addEventListener('load', () => {
    let defaultName = 'anonymous' + Math.floor(Math.random() * 20);
    loginCookie = getCookie('__discourse_proxy');
    console.log('loginCookie', loginCookie);
    if (loginCookie) {
        defaultName = decodeURIComponent(loginCookie.split('##')[0]);
    }
    let name = prompt("Please enter your name", defaultName);
    if (!name) {
        name = defaultName;
    }
    console.log(name);

    const params = new URLSearchParams(window.location.search);
    uid = params.has('uid') ? params.get('uid') : pad(Math.floor(Math.random() * 99999999), 8);
    registerShareButton();

    const ydoc = new Y.Doc();
    ydocClientID = ydoc.clientID;
    const rtcProviderUrl = "wss://bulletjournal.us:4444";
    const provider = new WebrtcProvider(uid, ydoc, {signaling: [rtcProviderUrl]});
    console.log("uid", uid);
    console.log("provider", provider);
    const type = ydoc.getText('quill');
    const editorContainer = document.getElementById('editor-container');

    const editor = new Quill(editorContainer, {
        modules: {
            syntax: {highlight: text => hljs.highlightAuto(text).value,},
            cursors: true,
            toolbar: [
                ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
                [
                    {list: 'ordered'},
                    {list: 'bullet'},
                    {list: 'check'},
                    {indent: '-1'},
                    {indent: '+1'},
                ],
                ['link'],
                ['clean'],
                [
                    {header: [1, 2, 3, false]},
                    {font: ["sans-serif", "serif", "monospace"] },
                    {size: ['small',  'large', 'huge'] },
                    {color: []},
                    {background: []},
                    {align: []},
                ],
            ],
            history: {
                delay: 500,
                maxStack: 100,
                userOnly: true,
            },
        },
        placeholder: 'Start collaborating...',
        theme: 'snow', // or 'bubble'
        bounds:editorContainer
    });
    setToolTips(editor);
    registerSaveButton(editor);

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    console.log("color:" + randomColor);
    // Define user name and user name
    // Check the quill-cursors package on how to change the way cursors are rendered
    provider.awareness.setLocalStateField('user', {
        name: name,
        color: randomColor
    });

    userList = provider.awareness.getStates();
    console.log(userList);
    updateUserList(userList);

    provider.awareness.on('update', ({added, updated, removed}) => {
        if (added.length !== 0 || removed.length !== 0) {
            userList = provider.awareness.getStates();
            console.log(userList);
            updateUserList(userList);
        }
    });

    fetch("/api/public/collab/" + uid)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            projectItem = data['projectItem'];
            if (projectItem && projectItem['name']) {
                document.title = projectItem['name'];
                document.getElementById('editor-title').innerText = projectItem['name'];
            }
            const content = data['contents'][0];
            console.log('content', content);
            let delta = JSON.parse(content['text'])['delta'];
            delta = new Delta(delta);
            console.log('delta', delta);
            setTimeout(() => {
                console.log('userList', userList);
                console.log('userList size', userList.size);
                if (userList.size === 1) {
                    // first user needs to initialize the doc
                    console.log('setContents');
                    editor.setContents(delta);
                }
            }, 1000);
            targetContentId = content['id'];
            if (!loginCookie || !targetContentId || !projectItem) {
                document.getElementById('save-button').style.display = "none";
                showWarning(projectItemNotExistWarning);
            }
            setTimeout(saveChanges, 60000, editor,true);
            const adsbygoogle = window.adsbygoogle || [];
            console.log('adsbygoogle', adsbygoogle);
            adsbygoogle.push({});
        })
        .catch(reason => console.log(reason));

    const binding = new QuillBinding(type, editor, provider.awareness);

    // @ts-ignore
    window.example = {provider, ydoc, type, binding, Y};
    window.addEventListener('beforeunload', function (e) {
        console.log('beforeunload', e);
        saveChanges(editor);
    });
});

const colors = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green',
    'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'yellow',
    'silver', 'teal', 'magenta', 'volcano',
    'gold', 'lime', 'cyan', 'geekblue', 'darkblue', 'darkred', 'darkgreen', 'darkorange', 'darkgray'];

const showSuccess = (info) => {
    iziToast.success({
        title: 'OK',
        position: 'topRight',
        titleSize: "20",
        titleLineHeight: "25",
        messageSize: '20',
        messageLineHeight: '25',
        message: info,
        timeout: 5000,
    });
};

const showInfo = (info) => {
    iziToast.info({
        title: 'Info',
        position: 'topRight',
        titleSize: "20",
        titleLineHeight: "25",
        messageSize: '20',
        messageLineHeight: '25',
        message: info,
        timeout: 5000,
    });
};

const showWarning = (warning) => {
    iziToast.warning({
        title: 'Caution',
        position: 'topRight',
        titleSize: "20",
        titleLineHeight: "25",
        messageSize: '20',
        messageLineHeight: '25',
        message: warning,
        timeout: 10000,
    });
};

const showWarningWithOption = (warning) => {
    iziToast.warning({
        title: 'Caution',
        position: 'topRight',
        titleSize: "20",
        titleLineHeight: "25",
        messageSize: '20',
        messageLineHeight: '25',
        message: warning,
        timeout: 10000,
        buttons: [
            ['<button>Request Access</button>', function (instance, toast) {
                requestAccess();
            }, true] // true to focus
        ],
    });
};

const requestAccess = () => {
    console.log('request Access');
    const headers = {'Content-Type': 'application/json'};
    fetch("/api/public/collab/" + uid + "/requestWrite", {headers: headers, method: 'POST'})
        .then(response => response.text())
        .then((data) => {
            showInfo(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

const projectItemNotExistWarning = "Please note that your change is not being saved in the server and your change will be lost once you leave this page. <br>You can keep a copy of your change before you leave.";
const noAccessWarning = (contentType) => {
    return "Please note that your change is not being saved in the server and your change will be lost once you leave this page. <br>You can either keep a copy of your change before you leave or ask the owner of this " + contentType + " to grant you access by either <br>inviting you to join its BuJo or use the share button to share it with you."
};


const setToolTips = (editor)=>{
    const toolbar = editor.container.previousSibling;
    toolbar.querySelector('span.ql-color').setAttribute('title', 'Text color');
    toolbar.querySelector('span.ql-background').setAttribute('title', 'Background color');
    toolbar.querySelector('span.ql-align').setAttribute('title', 'Align');
    toolbar.querySelector('button.ql-bold').setAttribute('title', 'Bold');
    toolbar.querySelector('button.ql-italic').setAttribute('title', 'Italic');
    toolbar.querySelector('button.ql-underline').setAttribute('title', 'Underline');
    toolbar.querySelector('button.ql-strike').setAttribute('title', 'Strikethrough');
    toolbar.querySelector('button.ql-blockquote').setAttribute('title', 'Quote');
    toolbar.querySelector('button.ql-code-block').setAttribute('title', 'Code');

    toolbar.querySelector('button.ql-list[value=ordered]').setAttribute('title', 'Numbered list');
    toolbar.querySelector('button.ql-list[value=bullet]').setAttribute('title', 'Bulleted list');
    toolbar.querySelector('button.ql-list[value=check]').setAttribute('title', 'Checkbox list');
    toolbar.querySelector('button.ql-indent[value="-1"]').setAttribute('title', 'Indent less');
    toolbar.querySelector('button.ql-indent[value="+1"]').setAttribute('title', 'Indent more');

    toolbar.querySelector('button.ql-link').setAttribute('title', 'Insert link');
    toolbar.querySelector('button.ql-clean').setAttribute('title', 'Remove formatting');
};
