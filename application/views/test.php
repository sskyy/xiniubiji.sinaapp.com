<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="/application/views/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="/application/views/css/style.css">
        <link rel="stylesheet" type="text/css" href="/application/views/css/base.css">

    </head>
    <body>
        <div class="test">


            <div class="component">
                <div id="template_event">
                </div>
            </div>

            <div class="component">
                <div id="editable_item">
                </div>
                <div id="editable_item_controller">
                    <a class="btn">change data</a>
                </div>
            </div>

            <div class="component">
                <div id="common_list">
                </div>
            </div>

            <div class="component">
                <div id="editable_select_con">
                </div>
            </div>
            
            <div class="component">
                <div >
                    <textarea id="test-textarea"></textarea>
                    <a id="test-textarea-submit">ok</a>
                </div>
            </div>


        </div>
        <script src="/application/views/js/sea.js" data-main="/application/views/js/test"></script>

        <script type="text/template" id="tpl-editable-item-container">
            <div class="editable-item"   event-click="edit">
                <div class="editable-content">
                    <div class="editable-items"></div>
                    <div class="editable-icons">
                        <span class="<%=icons.edit%> icon"></span>
                        <span class="<%=icons.delete%> icon" event-click="delete"></span>
                    </div>
                </div>
                <div class="editable-control">
                    <% for( var item_index in data_edit_names ){%>
                    <input type="text" value="<%=data[data_edit_names[item_index]]%>" id="<%=input_ids[data_edit_names[item_index]]%>"/>
                    <%}%>
                    <a class="btn btn-small">
                        <div class="icon-ok" event-click="edit_done"></div>
                    </a>
                </div>
            </div>
        </script>

        <script type="text/template" id="tpl-template-event">
            <div>
                <a event-click="alert">点我</a>
            </div>
        </script>

        <script type="text/template" id="tpl-common-list-item">
            <div><%= !(/^u/.test( typeof(id) )) ? id : data.id%></div>
        </script>



        <script type="text/template" id="tpl-editable-select">
            <div class="editable-select">
                <div class="editable-item"></div>
                <div class="common-list"></div>
            </div>
        </script>
    </body>
</html>
