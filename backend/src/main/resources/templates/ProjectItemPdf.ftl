<!DOCTYPE html>
<html>
<head>
    <style>
        @page {
            size: A4;
            margin: 10%;
            @top-center {
                content: element(header_center);
            }
            @bottom-center {
                content: element(footer_center);
            }
        }

        #header_center {
            position: running(header_center);
        }

        #footer_center {
            position: running(footer_center);
        }
    </style>
</head>

<body>
<div id="header_center" style="height: 35px" align="center" style="text-align:center">
    <!-- avatar -->
    <div>
        <a href="https://bulletjournal.us" style="text-decoration: none">
            <img src=
                 "https://user-images.githubusercontent.com/122956/72955931-ccc07900-3d52-11ea-89b1-d468a6e2aa2b.png"
                 width="33px" height="33px" alt="bullet avatar"/>
        </a>
    </div>
</div>

<div id="footer_center" style="text-align: center">
    <div class="col-lg-4 col-md-12 col-xs-12" style="color: grey">
        Bullet Journal ©2020 Powered by
        <a href="https://1o24bbs.com/c/bulletjournal/108"><span style="color: grey">1024 BBS</span></a>
    </div>
</div>

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
</body>

</html>
