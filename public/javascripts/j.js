//全局变量---------------------------------------------------------------------------------------------------------------

//--------------------------------------------------页面事件-------------------------------------------------------------
$(function(){
    $("#tbau").change(function(){
        var t = $("#tbau").val();
        if(t!=""){
            getauthor(t);
        }
    });
    $("#btnsave").click(function(){
        newauthor();
    });
    $(".au_paste").click(function(e){  //点击粘贴要查询的学者名
        var t = window.bound.getMemText();
        $("#tbau").val(t);
        if(t!=""){
            getauthor(t);
        }
    });
    $(".breadcrumb li").click(function(){
        var t = $(this).text();
        addItem(t,window.bound.getMemText());
    });
    //del attr oo
    $(document).on('click','.delattroo',function(e){  //unset
        var $me = $(e.target);
        var attrname = $me.parent().parent().attr('name');
        var v1 = $me.prev().prev().text();
        var v2 = $me.prev().text();
        var $pms = $me.parent().children();
        console.log($pms);
        var doc = {};
        for(var i=0;i<$pms.length;i++){
            if($($pms[i]).hasClass('v')){
                var k = $($pms[i]).attr('title');
                var v = $($pms[i]).text();
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
        var v2 = $me.prev().text();
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
        var doc = {};
        doc["$unset"] = {};
        doc["$unset"][attrname] = 1;
        del_attr(attrname,doc,$me);
    });

    //手动输入机构的时间
    $("#btntimeok").click(function(){
        var ntime = $.trim($("#inputtime").val());
        if(ntime)
        {
            editorgantime(ntime);
        }
    });
});
//----------------------------------------------以下为学者 ---------------------------------------------------------------
//获取学者详细信息
function getauthor(t){
    t = $.trim(t);
    $.get('/author',{t:t},function(data,status){
        if(data && data.length>0){
            var h="";
            data.forEach(function(au,index){
                h+=formatauthor(au);
            });
            $("#result").html(h);
        }
        else{
            $("#result").html("no this author. <a href='javascript:newauthor();'>new author</a>");
        }
    });
}
//新加学者
function newauthor(){
    var t = $.trim($("#tbau").val());
    if(t!=""){
        $.post('/save',{au:t,searchname: $.trim(t).toLowerCase()},function(data,status){
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
//显示学者(格式化内容)
function formatauthor(data)
{
    if(data.name){
        var h = '<div class="authorbox">';
        h+='<div class="aunamerow"><img src="/images/author1.png" /><span class="auname">'+data.name+'</span></div>';
        h+='<div class="auattrbox">';
        for(var key in data){
            if(key=="_id" || key=="name" || key=="searchname"){
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
                                    h+='<span class="v" title="'+n+'">'+x[n]+'</span>';
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
function addItem(item,val){
    var name = $("#tbau").val();
    item = item.toLowerCase();
    $.post('/add/'+item,{name:name,v1:'',v2:val},function(data,text){
        if(data){
            alert(data);
        }
        else{
            // show change to UI
            alert('add ok.');
        }
    })
}
//-----------------------------------------------通用删除----------------------------------------------------------------
//new del 2
function del_attr(attrname,doc,$me){
    alert('x');
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
                $me.parent().hide();
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
