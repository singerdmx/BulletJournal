<div style="display: flex; justify-content: center; width:90%; margin-left: auto; margin-right: auto; margin-top: 10px">
  <div style="width:100%;">
    <div style="padding-top: 10px; padding-bottom: 10px;">
      <div style="height: 25px; float: left">
        <div style="float: left">
          <img src="${requester_avatar}" alt="requester_avatar" style="border-radius: 50%;width:20px;height:20px;">
        </div>
        <div style="float: left">
          <span style="margin-left: 5px; color: #e8aed0;font-size: 17px; margin-right: 8px">${requester}</span>
        </div>
        <div style="float: left">
          <span style="font-size: 17px"> is sharing </span>
        </div>
        <div style="float: left">
          <span style="margin-left: 5px; color: #cc99ff;font-size: 17px;">&nbsp;${note_name}&nbsp;</span>
        </div>
        <div style="float: left">
          <span style="font-size: 17px"> with you.</span>
        </div>
      </div>
    </div>
    <br>
    <#include "Note.ftl">
  </div>
</div>
