<!DOCTYPE html>
<html>
<body>

<#switch project_item_type>
    <#case "note">
        <#include "Note.ftl">
        <#break>
    <#case "task">
        <#include "Task.ftl">
        <#break>
    <#case "transaction">
        <#include "Transaction.ftl">
        <#break>
    <#default>
</#switch>

<div style="text-align: center">
    <div class="col-lg-4 col-md-12 col-xs-12" style="color: grey">
        Bullet Journal ©2020 Powered by 1024 BBS
    </div>
</div>
</body>

</html>
