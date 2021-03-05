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
          <span style="margin-left: 5px; color: #cc99ff;font-size: 17px;">&nbsp;${transaction_name}&nbsp;</span>
        </div>
        <div style="float: left">
          <span style="font-size: 17px"> with you.</span>
        </div>
      </div>
    </div>
    <br>

    <div style="width: 100%; margin-bottom:20px; background-color:#f1f2f4">
      <div style="width: 98%; margin-right: 1%; margin-left: 1%; margin-top: 25px">
        <span style="color: #e8aed0; font-size:25px; width:48%; text-align:left">${transaction_name}</span>
      </div>
      <hr style="width: 98%;text-align:center;margin-left: auto;margin-right: auto;"/>
      <list style="margin-top: 15px; font-size: 17px">
        <li style="margin-left: 30px"><b>Transaction created by:</b> ${transaction_owner}</li>
        <li style="margin-left: 30px"><b>Create
            time:</b> ${create_at?date?string("yyyy-MM-dd hh:mm:ss")}</li>
        <li style="margin-left: 30px"><b>Update
            time:</b> ${update_at?date?string("yyyy-MM-dd hh:mm:ss")}</li>
        <#if payer?has_content>
          <li style="margin-left: 30px"><b>Payer:</b> ${payer}</li>
        </#if>
        <#if amount?has_content>
          <li style="margin-left: 30px"><b>Amount(USD):</b> ${amount}</li>
        </#if>
        <#if date?has_content>
          <li style="margin-left: 30px"><b>Date:</b> ${date}</li>
        </#if>
        <#if location?has_content>
          <li style="margin-left: 30px"><b>Location:</b> ${location}</li>
        </#if>
        <#if start_time?has_content>
          <li style="margin-left: 30px"><b>Start time:</b> ${start_time?date?string("yyyy-MM-dd hh:mm:ss")}</li>
        </#if>
        <#if ent_time?has_content>
          <li style="margin-left: 30px"><b>End time:</b> ${end_time?date?string("yyyy-MM-dd hh:mm:ss")}</li>
        </#if>
      </list>
        <#if contents?has_content>
            <#list contents as content>
              <hr style="width: 98%;text-align:center;margin-left: auto;margin-right: auto;"/>
              <div style="display:block; margin-left: 1%">
                <div style="height: 25px; width: 98%; float: left">
                  <div style="float: left">
                    <img src=${content.owner.avatar!"no_avatar"} alt="avatar"
                         style="border-radius: 50%;width:20px;height:20px;">
                  </div>
                  <div style="float: left">
                <span
                    style="margin-left: 5px; color: #e8aed0;font-size: 17px; margin-right: 8px">${content.owner.name}</span>
                  </div>
                  <div style="float: left">
                <span
                    style="margin-left: 5px; color: #cc99ff;font-size: 17px;">${(content.updatedAt)?number_to_date?string("yyyy-MM-dd hh:mm:ss")}</span>
                  </div>
                </div>
                <br>
                <div>${content.text}</div>
              </div>
            </#list>
        </#if>
    </div>
  </div>
</div>
