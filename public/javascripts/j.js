//全局变量---------------------------------------------------------------------------------------------------------------

//--------------------------------------------------页面事件-------------------------------------------------------------
$(function(){

    //初始化工作面板
    var username = $.QueryString['u'];
    $("#hdusername").val(username);
    console.log('startup.'+username);

    //调入以往的历史记录 后十条
    history();

    $("#tbau").change(function(){  //修改后查询学者名
        var t = $("#tbau").val();
        if(t!=""){
            //getauthor(t);
            searchauthor(t);
        }
    });
    $(".au_paste").click(function(e){  //粘贴后查询的学者名
        var t = window.bound.getMemText();
        $("#tbau").val(t);
        if(t!=""){
            //getauthor(t);
            searchauthor(t);
        }
    });

    $("#btnsave").click(function(){
        newauthor();
        $.get('/getlast',{},function(data,text){
            if(data){
                var a = formatauthor(data);
                $(a).prependTo($("#historybox"));
            }
        })
    });
    $(".breadcrumb li").click(function(){
        var t = $(this).text();
        var val = $.trim(window.bound.getMemText());
        if(val == "")
            return;
        t = t.toLowerCase();
        t = $.trim(t);
        var d = {};
        switch(t){
            case "organ":
                var doc = {};
                doc["$addToSet"]={};
                doc["$addToSet"][t] = {};
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
                doc["$addToSet"][t].no = val;
                doc["$addToSet"][t].tp = "";
                d.con = doc;
                break;
            case "homepage":
                var doc = {};
                doc["$addToSet"] = {};
                doc["$addToSet"][t] = {};
                doc["$addToSet"][t].hp = val;
                doc["$addToSet"][t].nt = "";
                d.con = doc;
                break;
        }
        add_attr(t,d);
    });

    //del attr oo
    $(document).on('click','.delattroo',function(e){  //unset
        var $me = $(e.target);
        var attrname = $me.parent().parent().attr('name');
//        var v1 = $me.prev().prev().text();
//        if(v1=='null') v1 = '';
//        var v2 = $me.prev().text();
//        if(v2=='null') v2='';
        var $pms = $me.parent().children();
        console.log($pms);
        var doc = {};
        for(var i=0;i<$pms.length;i++){
            if($($pms[i]).hasClass('v')){
                var k = $($pms[i]).attr('title');
                var v = $($pms[i]).text();
                if(v=='null') v='';
                doc[k] = v;
            }
        }
        var d = {};
        d["$unset"] = {};
        d["$unset"][attrname] = doc;
        del_attr(attrname,d,$me);
    });
    //del attr aa
    $(document).on('click','.delattrax',function(e){  //pull
        var $me = $(e.target);
        var attrname = $me.parent().parent().attr('name');
        var v1 = $me.prev().text();
        if(v1=='null') v1 = '';
        var doc ={};
        doc["$pull"] = {};
        doc["$pull"][attrname] = v1;
        del_attr(attrname,doc,$me);
    });
    //del attr ao
    $(document).on('click','.delattrao',function(e){  //pull
        var $me = $(e.target);
        var attrname = $me.parent().parent().attr('name');
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
    //del attr
    $(document).on('click','.delattrx',function(e){  //unset
        var $me= $(e.target);
        var attrname = $me.parent().parent().attr('name');
        var v1 = $me.prev().text();
        if(v1=='null') v1 = '';
        var doc = {};
        doc["$unset"] = {};
        doc["$unset"][attrname] = 1;
        del_attr(attrname,doc,$me);
    });

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
                    //h+='<div class="searchrow"><a href="javascript:getauthor(\''+au.name+'\');">'+au.name+'</a></div>';
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
    $.get('/author',{t:t},function(data,status){
        console.log(data);
        var h='';
        if(data){
            h+=formatauthor(data);
            $("#tbau").val(data.name);
            $("#detail").html(h);
            $("#searchbox").hide();
        }
//        if(data && data.length>0){
//            var h="";
//            data.forEach(function(au,index){
//                h+=formatauthor(au);
//                $("#tbau").val(au.name);
//            });
//            $("#detail").html(h);
//            $("#searchbox").hide();
//        }
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
//获取历史数据
function history(){
    var user = $("#hdusername").val();
    console.log('user:'+user);
    $.get('/getlastten',{user:user},function(data,text){
        console.log(data);
        if(data){
            var h = '';
            data.forEach(function(au,index){
                h+=formatauthor(au);
            })
            $("#historybox").html(h);
        }
    })
}

//显示学者(格式化内容)
function formatauthor(data)
{
    if(data.name){
        var h = '<div class="authorbox">';
        h+='<div class="aunamerow"><img src="/images/user.svg" /><span class="auname">'+data.name+'</span></div>';
        h+='<div class="auattrbox">';
        for(var key in data){
            if(key=="_id" || key=="name" || key=="searchname" || key=="time" || key=="user"){
                continue;
            }
            var tp = getType(data[key]);
            switch(tp.toString()){
                case "Array":
                    h+='<div class="attrnamerow"><span class="attr_name">'+key+'</span></div>';
                    h+='<div class="attrlistbox" name="'+key+'">';
                    for(var i =0;i<data[key].length;i++){
                        var x = data[key][i];
                        switch(getType(x)){
                            case "Array":
                                break;
                            case "Object":
                                h+='<div class="attrrow">';
                                for(var n in x){
                                    var _k = n;
                                    var _v = x[n];
                                    if(_v==''){
                                        _v = 'null';
                                    }
                                    h+='<span class="v" title="'+_k+'">'+_v+'</span>';
                                }
                                h+='<img src="/images/sad.svg" class="delattrao" /></div>';
                                break;
                            case "string":
                            case "number":
                                h+='<div class="attrrow"><span class="v">'+data[key][i]+'</span><img src="/images/sad.svg" class="delattrax" /></div>';
                                break;
                        }

                    }
                    h+='</div>';
                    break;
                case "Object":
                    h+='<div class="attrnamerow"><span class="attr_name">'+key+'</span></div>';
                    h+='<div class="attrlistbox" name="'+key+'">';
                    var o = data[key];
                    h+='<div class="attrrow">';
                    for(var k in o){
                        h+='<span class="v" title="'+k+'">'+o[k]+'</span>';
                    }
                    h+='<img src="/images/sad.svg" class="delattroo" /></div>';
                    h+='</div>';
                    break;
                case "string":
                case "number":
                    h+='<div class="attrnamerow"><span class="attr_name">'+key+'</span></div>';
                    h+='<div class="attrlistbox" name="'+key+'">';
                    h+='<div class="attrrow"><span class="v">'+data[key]+'</span><img src="/images/sad.svg" class="delattrx" /></div>';
                    h+='</div>';
                    break;
            }
        }
        h+='</div>';
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
function getType(x){
    if(x==null){
        return "null";
    }
    var t= typeof x;
    if(t!="object"){
        return t;
    }
    var c=Object.prototype.toString.apply(x);
    c=c.substring(8,c.length-1);
    if(c!="Object"){
        return c;
    }
    if(x.constructor==Object){
        return c
    }
    if("classname" in x.prototype.constructor
        && typeof x.prototype.constructor.classname=="string"){
        return x.constructor.prototype.classname;
    }
    return "<unknown type>";
}
