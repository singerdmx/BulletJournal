/* eslint-env browser */

import * as Y from 'yjs';
import {QuillBinding} from 'y-quill';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import {WebrtcProvider} from 'y-webrtc';
import hljs from 'highlight.js';


const Delta = Quill.import('delta');

let userList = {};
let loginCookie = null;
let targetContentId = null;
let projectItem = null;
let uid = null;
let ydocClientID = null;

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

function saveChanges(editor) {
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
            setTimeout(saveChanges, 60000, editor);
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
        if (!loginCookie || !targetContentId || !projectItem) {
            return;
        }
        const newContent = JSON.stringify({
            text: editor.getContents()
        });
        const putBody = JSON.stringify({
            text: newContent,
            contentType: projectItem['contentType'],
            itemId: projectItem['id'],
            contentId: targetContentId,
        });
        console.log('Saving content', newContent);
        const headers = {'Content-Type': 'application/json'};
        fetch("/api/public/collab/" + uid, {headers: headers, method: 'PUT', body: putBody})
            .then(res => console.log(res));
    }
};

window.addEventListener('load', () => {
    let defaultName = 'anonymous' + Math.floor(Math.random() * 20);
    loginCookie = getCookie('__discourse_proxy');
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
                [
                    {header: [1, 2, 3, false]},
                    {color: []},
                    {background: []},
                    {align: []},
                ],
                ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
                [
                    {list: 'ordered'},
                    {list: 'bullet'},
                    {indent: '-1'},
                    {indent: '+1'},
                ],

                ['link'],

                ['clean'],
            ],
            history: {
                delay: 500,
                maxStack: 100,
                userOnly: true,
            },
        },
        placeholder: 'Start collaborating...',
        theme: 'snow' // or 'bubble'
    });

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
            console.log('userList', userList);
            console.log('userList size', userList.size);
            if (userList.size === 1) {
                // first user needs to initialize the doc
                console.log('setContents');
                editor.setContents(delta);
            }
            targetContentId = content['id'];
            if (!loginCookie || !targetContentId || !projectItem) {
                document.getElementById('save-button').style.display = "none";
            }
            setTimeout(saveChanges, 60000, editor);
            const adsbygoogle = window.adsbygoogle || [];
            console.log('adsbygoogle', adsbygoogle);
            adsbygoogle.push({});
        })
        .catch(reason => console.log(reason));

    const binding = new QuillBinding(type, editor, provider.awareness);

    // @ts-ignore
    window.example = {provider, ydoc, type, binding, Y}
    window.addEventListener('beforeunload', function (e) {
        console.log('beforeunload', e);
        saveChanges(editor);
    });
});

const colors = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green',
    'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'yellow',
    'silver', 'teal', 'magenta', 'volcano',
    'gold', 'lime', 'cyan', 'geekblue', 'darkblue', 'darkred', 'darkgreen', 'darkorange', 'darkgray'];

