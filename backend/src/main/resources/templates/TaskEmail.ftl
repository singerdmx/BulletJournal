<html>
<body>

<div style="width: 800px; margin-bottom: 20px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s">
  <div style="width: 98%; margin-right: 1%; margin-left: 1%; margin-top: 25px">
    <span style="color: #e8aed0; font-size:25px; width:48%; text-align:left">${task_name}</span>
  </div>

  <hr style="width: 98%;text-align:center;margin-left: auto;margin-right: auto;">
  <list style="margin-top: 15px; font-size: 17px">
    <li style="margin-left: 30px"><b>Task owner:</b> ${task_owner}</li>
    <li style="margin-left: 30px"><b>Create time:</b> ${create_at?date?string("yyyy-MM-dd hh:mm:ss")}</li>
    <#if status?has_content>
      <li style="margin-left: 30px"><b>Status:</b> ${status}</li>
    </#if>
    <#if location?has_content>
      <li style="margin-left: 30px"><b>Location:</b> ${location}</li>
    </#if>
    <#if assignee?has_content>
      <li style="margin-left: 30px"><b>Assignee:</b> ${assignee}</li>
    </#if>
    <#if due_date?has_content>
      <li style="margin-left: 30px"><b>Due date:</b> ${due_date}</li>
    </#if>
  </list>
  <#if contents?has_content>
    <#list contents as content>
      <hr style="width: 98%;text-align:center;margin-left: auto;margin-right: auto;">
      <div style="display:block; margin-left: 1%">
        <div style="height: 25px; width: 98%; float: left">
          <div style="float: left">
            <img src=${content.owner.avatar!"no_avatar"} alt="avatar" style="border-radius: 50%;width:20px;height:20px;">
          </div>
          <div style="float: left">
            <span style="margin-left: 5px; color: #e8aed0;font-size: 17px; margin-right: 8px">${content.owner.name}</span>
          </div>
          <div style="float: left">
            <span style="margin-left: 5px; color: #cc99ff;font-size: 17px;">${(content.updatedAt)?number_to_date?string("yyyy-MM-dd hh:mm:ss")}</span>
          </div>
        </div>
        <br>
        <div>${content.text}</div>
      </div>
    </#list>
  </#if>
</div>

</body>
</html>