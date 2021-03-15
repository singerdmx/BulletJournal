<!DOCTYPE html>
<html>
<head>
    <style>
        @page {
            size: A4;
            margin: 10%;
            /*size: letter landscape;*/
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

<div style="width:100%; margin-left: auto; margin-right: auto; margin-top: 10px">
    <div style="width: 100%; margin-bottom:20px; background-color:#f1f2f4">
        <div style="width: 98%; margin-right: 1%; margin-left: 1%; margin-top: 25px">
            <span style="color: #e8aed0; font-size:25px; width:48%; text-align:left">${note_name}</span>
        </div>
        <hr style="width: 98%;text-align:center;margin-left: auto;margin-right: auto;"/>
        <list style="margin-top: 15px; font-size: 17px">
            <li style="margin-left: 30px"><b>Note created by:</b> ${note_owner}</li>
            <li style="margin-left: 30px"><b>Create
                    time:</b> ${create_at?date?string("yyyy-MM-dd hh:mm:ss")}</li>
            <li style="margin-left: 30px"><b>Update
                    time:</b> ${update_at?date?string("yyyy-MM-dd hh:mm:ss")}</li>
            <#if location?has_content>
                <li style="margin-left: 30px"><b>Location:</b> ${location}</li>
            </#if>
        </list>
        <#if contents?has_content>
            <#list contents as content>
                <hr style="width: 98%;text-align:center;margin-left: auto;margin-right: auto;"/>
                <div style="display:block; margin-left: 1%">
                    <div style="height: 25px; width: 98%; float: left">
                        <div style="float: left">
                            <img src=${content.owner.avatar!"no_avatar"} alt="avatar"
                                 style="border-radius: 50%;width:20px;height:20px;"/>
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
                    <br/>
                    <div>${content.text}</div>
                </div>
            </#list>
        </#if>
    </div>
</div>

</body>

</html>