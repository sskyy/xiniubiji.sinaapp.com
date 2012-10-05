<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="/application/views/css/base.css">
        <style>
            body{
                display:none;
            }
        </style>
    </head>
    <body id="body">
        <div id="container-head">
            <div style="width:100%">
                <div id="container-navbar">
                    <div id="navbar">
                        <div id="logo"></div>
                        <div id="logo-small"></div>

                        <div id="user-container" class="fr ib">

                        </div>
                        <input type="text" id="book-search" placeholder="找到你要写笔记的书" data-action="book-search">
                    </div>
                </div>
            </div>
        </div>
        <div id="container-body">
            <div id="container-page">
                <div id="page_index" class="page page_rendered">
                    <div id="page_index_banner"></div>
                </div>


                <div id="page_my_account" class="page">
                    <div id="my_info">

                    </div>
                    <div id="my_follow" class="account_page active">
                        <div class="account_page_title">我关注的笔记</div>
                        <div id="my_follow_list">

                        </div>
                    </div>
                    <div id="my_notes" class="account_page">
                        <div class="account_page_title">我写过笔记的书</div>
                        <div id="my_note_list">

                        </div>
                    </div>
                </div>



                <div id="page_books" class="page">

                    <div class="message" data-condition="search-result">

                    </div>

                    <div id="book-create-container">

                    </div>
                    <div id="books-container" class="books-container pr">
                        <div id="books-list-container" class="clearfix pr">

                        </div>
                        <div class="page-controller controller-left"></div>
                        <div class="page-controller controller-right"></div>
                    </div>

                    <div class="message cb" data-condition="search-result-then">

                    </div>

                    <!--                    <div id="container-categories">
                                            <div class="categories-container">
                                                <div class="categories-background"></div>
                                                <div class="categories">
                                                    <div class="categories-line">
                                                        <span class="category-label">[文学]</span>
                                                        <span class="category">小说</span>
                                                        <span class="category">随笔</span>
                                                        <span class="category">散文</span>
                                                        <span class="category">日本文学</span>
                                                        <span class="category">童话</span>
                                                        <span class="category">诗歌</span>
                                                        <span class="category">名著</span>
                                                        <span class="category">港台</span>
                                                    </div>
                                                    <div class="categories-line">
                                                        <span class="category-label">[文学]</span>
                                                        <span class="category">小说</span>
                                                        <span class="category">随笔</span>
                                                        <span class="category">散文</span>
                                                        <span class="category">日本文学</span>
                                                        <span class="category">童话</span>
                                                        <span class="category">诗歌</span>
                                                        <span class="category">名著</span>
                                                        <span class="category">港台</span>
                                                    </div>
                                                    <div class="categories-line">
                                                        <span class="category-label">[文学]</span>
                                                        <span class="category">小说</span>
                                                        <span class="category">随笔</span>
                                                        <span class="category">散文</span>
                                                        <span class="category">日本文学</span>
                                                        <span class="category">童话</span>
                                                        <span class="category">诗歌</span>
                                                        <span class="category">名著</span>
                                                        <span class="category">港台</span>
                                                    </div>
                                                    <div class="categories-line">
                                                        <span class="category-label">[文学]</span>
                                                        <span class="category">小说</span>
                                                        <span class="category">随笔</span>
                                                        <span class="category">散文</span>
                                                        <span class="category">日本文学</span>
                                                        <span class="category">童话</span>
                                                        <span class="category">诗歌</span>
                                                        <span class="category">名著</span>
                                                        <span class="category">港台</span>
                                                    </div>
                                                    <div class="categories-line">
                                                        <span class="category-label">[文学]</span>
                                                        <span class="category">小说</span>
                                                        <span class="category">随笔</span>
                                                        <span class="category">散文</span>
                                                        <span class="category">日本文学</span>
                                                        <span class="category">童话</span>
                                                        <span class="category">诗歌</span>
                                                        <span class="category">名著</span>
                                                        <span class="category">港台</span>
                                                    </div>
                                                </div>
                                            </div>
                    
                                            <div class="trigger-container">
                                                <div class="trigger"><span class="trigger-text">标签</span></div>
                                            </div>
                    
                                        </div>-->
                </div>





                <div id="page_note_list" class="page">
                    <div class="note-book">

                    </div>

                    <div id ="notes_list" class="notes_list">

                    </div>

                    <div class="message" data-condition="note-list-result"></div>
                </div>


                <div id="page_param_list" class="page">
                    <div id="param_list">

                    </div>

                    <div id="auto-chapter-nav-container" data-condition ="auto-chapter-nav">

                    </div>
                </div>



                <div id="page_note_create" class="page">

                    <div id="param-create-con">
                        <div class="param-create">
                            <div class="param-meta">
                                <div class="param-meta-item note-chapter-added empty"></div>
                                <div class="param-meta-item note-add-chapter">
                                    <div class="note-add-chapter-input"></div>
                                    <div class="note-add-chapter-select"></div>
                                </div>
                                <div class="param-meta-meta-item param-page"></div>
                                <div class="param-meta-item param-line"></div>
                            </div>
                            <div class="param-textarea">
                                <textarea id="param-add-textarea"></textarea>
                            </div>
                        </div>
                        <div id="param-book" class="fr param-book">

                        </div>
                        <div class="fl btn" event-click="save_param">保存</div>
                    </div>
                </div>


                <div class="page" id="register">

                </div>
            </div>

            <div id="global-nav-btns">
                <div data-condition="global-nav-btn-top"> 
                </div>
            </div>

        </div>
        <div id="container-foot">
            <div id="leave_message">
                <div class="text">留言</div>

                <div class="content">
                    <textarea id="leave_message_textarea" rows="5">

                    </textarea>
                    <div>
                        <div class="btn">提交</div>
                        <div class="message_info"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- old -->

        <!--        <div id="page_container">
                    <div id="page_container_left">
        
                    </div>
        
                    <div id="page_container_middle" class="container-fluid">
        
        
                    </div>
        
                    <div id="page_container_right">
                        <div id="nav">
                            <div><a target_id="page_index">1</a></div>
                            <div><a target_id="page_catagory">2</a></div>
                            <div><a target_id="page_note_list">3</a></div>
                            <div><a target_id="page_note_detail">4</a></div>
                            <div><a target_id="page_note_create">5</a></div>
                        </div>
                    </div>
                </div>-->

        <script src="/application/views/js/sea.js" data-main="/application/views/js/init"></script>

        <script type="text/template" id="tpl-book_type">
            <div class="catagory"><%=name%></div>
        </script>

        <script type="text/template" id="tpl-book">
            <div class="book">
                <div class="book-cover"  event-click="book_click">
                    <% if( typeof( cover ) != 'undefined' ){%>
                    <img src='<%=cover%>'/>
                    <%}%>
                </div>
                <div class="book-detail">
                    <% if(  !(/^u/.test(typeof(author))) && Util.value_var(author)  ){%>
                    <span class="book-detail-item book-author">
                        <span class="book-detail-item-label">作者</span>
                        <span class="book-detail-item-content"><%=Util.value_var( author )%></span>
                    </span>
                    <%}%>
                    <% if(  !(/^u/.test(typeof(publisher))) && Util.value_var(publisher)  ){%>
                    <span class="book-detail-item book-publisher">
                        <span class="book-detail-item-label">出版社</span>
                        <span class="book-detail-item-content"><%= Util.value_var(publisher )%></span>
                    </span>
                    <%}%>
                    <% if(  !(/^u/.test(typeof(pubdate))) && Util.value_var(pubdate)  ){%>
                    <span class="book-detail-item book-pubdate">
                        <span class="book-detail-item-label">出版时间</span>
                        <span class="book-detail-item-content"><%= Util.value_var(pubdate )%></span>
                    </span>
                    <%}%>
                    <span class="book-detail-item book-note-quantity"><%= !(/^u/.test(typeof(notes))) ? Util.value_var(notes) : '' %></span>
                </div>
                <div class="book-name"  event-click="book_click"><%=name%></div>
            </div>
        </script>

        <script type="text/template" id="tpl-note">
            <div class="note">
                <div class="note-meta">
                    <div class="note-meta-item note-author"><%=user.email%></div>
                    <div class="note-meta-item note-quantity"></div>
                    <div class="note-meta-item note-last-complete">未完成</div>
                    <div class="note-meta-item note-last-update">最后更新于<%= Util.formatDate(last_param.created)%></div>
                    <% if( !(/^u/.test(typeof( followed ))) ){%>
                    <%if( Util.value_var(followed) ){%>
                    <div class="note-meta-item note-follow">已关注</div>
                    <%}%>
                    <%}%>

                    <div class="note-meta-item note-follow">
                        <span class="btn btn-small" event-click="follow" >
                            <%= !(/^u/.test(typeof( followed ))) &&Util.value_var(followed) ? "取消关注" : "加关注"%>
                        </span>
                    </div>
                </div>
                <div class="note-preview">
                    <%= !( /^u/.test(typeof(last_param)))? last_param.content : ""%>
                </div>
            </div>
        </script>


        <script type="text/template" id="tpl-editable-item-container">
            <div class="editable-item"   event-click="edit">
                <div class="editable-content">
                    <div class="editable-item-items"></div>
                    <div class="editable-icons">
                        <span class="<%=icons.edit%> icon"></span>
                        <span class="<%=icons.delete%> icon" event-click="delete"></span>
                    </div>
                </div>
                <div class="editable-control">
                    <% for( var item_index in data_edit_names ){%>
                    <input type="text"  class="input-small" value="<%=data[data_edit_names[item_index]]%>" id="<%=input_ids[data_edit_names[item_index]]%>"/>
                    <%}%>
                    <!--                    <a class="btn btn-small">
                                            <div class="icon-ok" event-click="edit_done"></div>
                                        </a>-->
                </div>
            </div>
        </script>

        <script type="text/template" id="tpl-common-list-item">
            <div>
                <%=name%>
            </div>
        </script>

        <script type="text/template" id="tpl-book-simple">
            <div class="item">
                <%=name%> - <%=author%>
            </div>
        </script>

        <script type="text/template" id="tpl-editable-select">
            <div class="editable-select">
                <div class="editable-item-container"></div>
                <div class="common-list-container"></div>
            </div>
        </script>

        <script type="text/template" id="tpl-book-create">
            <div>
                <div id="book-create">

                </div>
                <div>
                    <a class="btn disabled">已添加</a>
                    <a class="btn">写笔记</a>
                </div>
            </div>
        </script>

        <script type="text/template" id="tpl-search-result-then">
            <div>
                <span>如果没有找到你想要的书，你可以进行伟大的</span>
                <a event-click="create_book" class="btn">添加</a>
            </div>
        </script>

        <script type="text/template" id="tpl-search-result-empty">
            <div>
                <span>没有找到你想要的书，你可以进行伟大的添加</span>
            </div>
        </script>

        <script type="text/template" id="tpl-login">
            <div id="login-container" class="fr ib">
                <span class="text">登陆</span>
                <div id="login-form">
                    <div class="form-line">
                        <span class="register-message"></span>
                    </div>
                    <div class="form-line"><input type="text"id="login-email" placeholder="email"/></div>
                    <div class="form-line"><input type="password" id="login-password" placeholder="password"/></div>
                    <div class="form-line" >
                        <a class="btn" id="login-login" event-click="login">登陆</a>
                        <a class="btn" id="login-register" event-click="register">注册</a>
                    </div>

                </div>
            </div>
        </script>

        <script type="text/template" id="tpl-param">
            <div>
                <div class="param-metas">
                    <span  class="param-meta">章节：<%=chapter.name%></span>
                    <span  class="param-meta"><%=Util.formatDate(created)%></span>
                </div>
                <div class="param-content">
                    <%=content%>
                </div>
            </div>
        </script>

        <script type="text/template" id="tpl-current-user">
            <div>
                <div class="text" event-click="view_my_account"><%=email %></div>
                <span  class="text" event-click="logout">退出</span>
            </div>

        </script>

        <script type="text/template" id="tpl-auto-chapter-nav-item">
            <div event-click="chapter_click" class='chapter <%= !pid ? "level-top" : ""%>'>
                <span class="text"><%=name%></span>
            </div>
        </script>

        <script type="text/template" id="tpl-nav-btn-top">
            <div class="nav-btn nav-btn-top" event-click="prev_page"></div>
        </script>

        <script type="text/template" id="tpl-note-list-empty">
            <div>还没有人对这本书写过笔记， 你来写第一篇吧。</div>
        </script>

        <script type="text/template" id="tpl-note-followed">
            <div class="note-followed" event-click="note_click">
                <div class="book">
                    <div class="book-cover"  event-click="book_click">
                        <% if( typeof( book.cover ) != 'undefined' ){%>
                        <img src='<%=book.cover%>'/>
                        <%}%>
                    </div>
                    <div class="book-detail">
                        <% if(  !(/^u/.test(typeof( book.author ) ) ) && Util.value_var( book.author )  ){%>
                        <span class="book-detail-item book-author">
                            <span class="book-detail-item-label">作者</span>
                            <span class="book-detail-item-content"><%=Util.value_var( book.author )%></span>
                        </span>
                        <%}%>
                        <% if(  !(/^u/.test(typeof( book.publisher ))) && Util.value_var( book.publisher )  ){%>
                        <span class="book-detail-item book-publisher">
                            <span class="book-detail-item-label">出版社</span>
                            <span class="book-detail-item-content"><%= Util.value_var(book.publisher )%></span>
                        </span>
                        <%}%>
                        <% if(  !(/^u/.test(typeof( book.pubdate ))) && Util.value_var( book.pubdate )  ){%>
                        <span class="book-detail-item book-pubdate">
                            <span class="book-detail-item-label">出版时间</span>
                            <span class="book-detail-item-content"><%= Util.value_var( book.pubdate )%></span>
                        </span>
                        <%}%>
                        <span class="book-detail-item book-note-quantity"><%= !(/^u/.test(typeof( book.notes ))) ? Util.value_var( book.notes) : '' %></span>
                    </div>
                    <div class="book-name"  event-click="book_click"><%= book.name%></div>
                </div>

                <div class="note">
                    <div class="note-meta">
                        <div class="note-meta-item note-author"><%=user.email%></div>
                        <div class="note-meta-item note-quantity"></div>
                        <div class="note-meta-item note-last-complete">未完成</div>
                        <div class="note-meta-item note-last-update">最后更新于<%= Util.formatDate(last_param.created)%></div>
                        <% if( !(/^u/.test(typeof( followed ))) ){%>
                        <%if( Util.value_var(followed) ){%>
                        <div class="note-meta-item note-follow">已关注</div>
                        <%}%>
                        <%}%>

                    </div>
                    <div class="note-preview">
                        <%= !( /^u/.test(typeof(last_param)))? last_param.content : ""%>
                    </div>
                </div>
            </div>
        </script>
    </body> 
</html>
