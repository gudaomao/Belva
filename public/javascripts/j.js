//全局变量---------------------------------------------------------------------------------------------------------------

//--------------------------------------------------页面事件-------------------------------------------------------------
$(function(){
    //初始化工作面板
    var username = $.QueryString['u'];
    $("#hdusername").val(username);
    console.log('startup.'+username);

    //调入以往的历史记录 后十条
    history();


    //修改后查询学者名
    $("#tbau").change(function(){
        var t = $("#tbau").val();
        if(t!=""){
            //getauthor(t);
            searchauthor(t);
        }
    });
    //粘贴后查询的学者名
    $(".au_paste").click(function(e){
        var t = window.bound.getMemText();
        $("#tbau").val(t);
        if(t!=""){
            //getauthor(t);
            searchauthor(t);
        }
    });
    //保存新的学者
    $("#btnsave").click(function(){
        newauthor();
        $.get('/getlast',{},function(data,text){
            if(data){
                var a = formatauthor(data);
                $(a).prependTo($("#historybox"));
            }
        })
    });
    //给学者加新的属性
    $(".breadcrumb li").click(function(){
        var t = $(this).text();
        var val = $.trim(window.bound.getMemText());
        if(val == "")
            return;
        val = val.replace(/\r/g,'');
        t = t.toLowerCase();
        t = $.trim(t);
        var d = {};
        switch(t){
            case "organ":
                var doc = {};
                doc["$addToSet"]={};
                doc["$addToSet"][t] = {};
                doc["$addToSet"][t].obj =1;
                doc["$addToSet"][t].og = val;
                doc["$addToSet"][t].tm = "";
                d.con = doc;
                break;
            case "email":
                var doc = {};
                doc["$addToSet"] = {};
                doc["$addToSet"][t] = val;
                d.con = doc;
                break;
            case "tel":
                var doc = {};
                doc["$addToSet"] = {};
                doc["$addToSet"][t] = {};
                doc["$addToSet"][t].obj = 1;
                doc["$addToSet"][t].number = val;
                doc["$addToSet"][t].type = "";
                d.con = doc;
                break;
            case "homepage":
                var doc = {};
                doc["$addToSet"] = {};
                doc["$addToSet"][t] = val;
                d.con = doc;
                break;
            case "location":
                var doc = {};
                doc["$addToSet"] = {};
                doc["$addToSet"][t] = {};
                doc["$addToSet"][t].obj = 1;
                doc["$addToSet"][t].location = val;
                doc["$addToSet"][t].time = "";
                d.con = doc;
                break;
            case "fields":
                var doc = {};
                doc["$addToSet"] = {};
                doc["$addToSet"][t]= {};
                doc["$addToSet"][t].obj = 1;
                doc["$addToSet"][t].fields = val;
                doc["$addToSet"][t].time = "";
                d.con = doc;
                break;
            case "position":
                var doc = {};
                doc["$addToSet"] = {};
                doc["$addToSet"][t] = val;
                d.con = doc;
                break;
            case "source":
                var doc = {};
                doc["$addToSet"] = {};
                doc["$addToSet"][t] = val;
                d.con = doc;
                break;
        }
        add_attr(t,d);
    });
    //del attr aa
    $(document).on('click','.delattrax',function(e){  //pull
        var $me = $(e.target);
        var attrname = $me.parent().parent().attr('name');
        console.log('attrname:'+attrname);
        var v1 = $me.prev().text();
        if(v1=='null') v1 = '';
        var doc ={};
        doc["$pull"] = {};
        doc["$pull"][attrname] = v1;
        del_attr(attrname,doc,$me);
    });
    //del attr ao
    $(document).on('click','.delattrao',function(e){  //pull
        console.log('delattrao:');
        var $me = $(e.target);
        var attrname = $me.parent().parent().attr('name');
        console.log('attrname:'+attrname);
        var v1 = $me.prev().prev().text();
        if(v1 =='null') v1 = '';
        var v2 = $me.prev().text();
        if(v2=='null') v2= '';
        var d = {};
        var v1t = $me.prev().prev().attr('title');
        var v2t = $me.prev().attr('title');
        d[v1t] = v1;
        d[v2t] = v2;
        var doc = {};
        doc["$pull"] = {};
        doc["$pull"][attrname]= d;
        del_attr(attrname,doc,$me);
    });
    //edit attr ao
    $(document).on('click','.editattrao',function(e){
        console.log('editattrao');
        var $me = $(e.target);
        var attrname = $me.parent().parent().attr('name');
        var doc =
    })
});
//----------------------------------------------以下为学者 ---------------------------------------------------------------
//搜索学者
function searchauthor(t){
    t = $.trim(t).toLowerCase();
    if(t){
        $.get('/search',{t:t},function(data,text){
            console.log('data:');
            console.log(data.length);
            console.log('data:');
            console.log(data);
            if(data && data.length>0){
                var h = '';
                data.forEach(function(au,index){
                    h+='<div class="aunamerow"><img src="/images/user.svg" /><span class="auname"><a href="javascript:getauthor(\''+au.name+'\');">'+au.name+'</a></span></div>';
                })
                $("#searchbox").html(h);
            }
            else{
                $("#searchbox").html("no this author. <a href='javascript:newauthor();'>new author</a>");
            }
            $("#searchbox").show();
            history();
        });
    }
}
//获取学者详细信息
function getauthor(t){
    t = $.trim(t);
    console.log(t);
    $.get('/author',{t:t},function(data,status){
        //console.log(data);
        var h='';
        if(data){
            h+=formateditauthor(data);
            $("#tbau").val(data.name);
            $("#detail").html(h);
            $("#searchbox").hide();
        }
        if(data && data.length>0){
            var h="";
            data.forEach(function(au,index){
                h+=formatauthor(au);
                $("#tbau").val(au.name);
            });
            $("#detail").html(h);
            $("#searchbox").hide();
        }
    });
}
//新加学者
function newauthor(){
    var t = $.trim($("#tbau").val());
    if(t!=""){
        var user = $("#hdusername").val();
        $.post('/save',{user:user,au:t,searchname: $.trim(t).toLowerCase()},function(data,status){
            if(data){
                if(data.msg=="ok"){
                    getauthor(t);
                }
                else{
                    $("#result").html(data.msg);
                }
            }
        });
    }
}
//获取最近的十个学者
function history(){
    var user = $("#hdusername").val();
    console.log('user:'+user);
    $.get('/getlastten',{user:user},function(data,text){
        console.log(data);
        if(data){
            var h = '';
            data.forEach(function(au,index){
                h+=formathistoryauthor(au,true);
            })
            $("#historybox").html(h);
        }
    })
}

//显示学者(当前学者)
function formateditauthor(data){
    h = '<div class="authorbox">';
    h+='<div class="aunamerow"><a href="/del/author/'+data.name+'"><img src="/images/user.svg" /></a><span class="auname">'+data.name+'</span></div>';
    h+='<div class="auattrbox">';
    h+=formatattr(data);
    h+='</div>';
    h+='</div>';
    return h;
}
//显示学者(历史学者)
function formathistoryauthor(data, isfold)
{
    var h='';
    if(data.name){
        h = '<div class="authorbox">';
        h+='<div class="aunamerow"><img src="/images/user.svg" /><span class="auname"><a href="javascript:getauthor(\''+data.name+'\');">'+data.name+'</a></span></div>';
        h+='<div class="auattrbox'+((isfold)?' hidden':'')+'">';
        h+=formatattr(data);
        h+='</div>';
        h+='</div>';
    }
    return h;
}
//格式化学者
function formatattr(data){
    var h='';
    for(var key in data){
        if(key=="_id" || key=="name" || key=="searchname" || key=="time" || key=="user"){
            continue;
        }
        h+='<div class="attrnamerow"><span class="attr_name">'+key+'</span></div>';
        h+='<div class="attrlistbox" name="'+key+'">';
        var arr = data[key];
            for(var i=0;i<arr.length;i++){
                var a = arr[i];
                console.log(a);
                if(a.obj){
                    h+='<div class="attrrow">';
                    for(var k in a){
                        if(k=='obj'){
                            continue;
                        }
                        h+='<span class="v" title="'+k+'">'+a[k]+'</span>';
                    }
                    h+='<img src="/images/sad.svg" class="delattrao" /> <img src="/images/edit.svg" class="editattrao" />';
                    h+='</div>';
                }
                else{
                    h+='<div class="attrrow">';
                    h+='<span class="v">'+a+'</span>';
                    h+='<img src="/images/sad.svg" class="delattrax" /> <img src="/images/edit.svg" class="editattraa" />';
                    h+='</div>';
                }
            }
        h+='</div>';
    }
    return h;
}

//-----------------------------------------------通用添加----------------------------------------------------------------
function add_attr(attrname,doc)
{
    var name = $("#tbau").val();
    doc.name = name;
    $.post('/addattr',doc,function(err){
        if(err){
            alert(err);
        }
        else{
            getauthor(name);
        }
    });
}
//-----------------------------------------------通用删除----------------------------------------------------------------
//new del 2
function del_attr(attrname,doc,$me)
{
    console.log(doc);
    var name = $("#tbau").val();
    name = $.trim(name);
    var p = {};
    p.name = name;
    p.con = doc;
    console.log(doc);
    if(name && name.length>0){
        $.post('/delattr',p,function(data,textStatus){
            if(data && data!=''){
                alert(data);
            }
            else{
                //$me.parent().hide();
                getauthor(name);
            }
        });
    }
}


//------------------------------------------------通用方法---------------------------------------------------------------
