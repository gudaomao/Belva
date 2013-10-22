//全局变量---------------------------------------------------------------------------------------------------------------
//给哪个机构设置年份
var $organtime, newtime;



//
$(function(){
    $("#tbau").change(function(){
        searchauthor();
    });
    $("#btnsave").click(function(){
        newauthor();
    });
    $(document).on('click','.f_tm',function(e){  //点击选择新的机构时间
        $me=$(e.target);
        var tm = $me.text();
        editorgantime(tm);
    }).on('click','.au_new_organ',function(){  //点击新加机构
        var memog = window.bound.getMemText();
        neworgan(memog);
    }).on('click','.au_del_organ',function(e){  //点击删除机构
        var $me = $(e.target);
        var og = $me.prev().text();
        var tm = $me.prev().prev().text();
        delorgan(tm,og,$me);
    }).on('click','.au_paste',function(e){  //点击粘贴要查询的学者名
        var memau = window.bound.getMemText();
        $("#tbau").val(memau);
        searchauthor();
    }).on('click','.au_og_tm',function(e){  //点击机构中的时间
        var $me = $(e.target);
        newtime = $me.text();
        $organtime = $me;
        $("#floattimebox").show();
    });
});
//以下为学者 ------------------------------------------------------------------------------------------------------------
//搜索学者
function searchauthor(){
    console.log('search author:');
    var t = $("#tbau").val();
    if(t!=""){
        getauthor(t);
    }
};
//获取学者详细信息
function getauthor(t){
    $.get('/author',{t:t},function(data,status){
        if(data && data.length>0){
            console.log('ok.');
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
    console.log('format:');
    var h = '<div class="authorbox">';
    h+='<div class="au_name"><img src="images/author1.png" />'+data.name+'</div>';

    h+='<div class="au_organ_box">'
    var og = '<img src="/images/new.png" class="au_new_organ" />'
    h+='<div class="au_og_name">Organ: '+og+'</div>';
    h+='<div class="au_og_list">';
    if(data.organ){
        data.organ.forEach(function(og,index){
            console.log(og);
            var xog = og.og;
            var xtm = og.tm;
            h+='<div class="au_organ">';
            h+='<span class="au_og_tm">'+xtm+'</span>,';
            h+='<span class="au_og_nm">'+xog+'</span>';
            h+='<img src="/images/del.png" class="au_del_organ" /></div>';
        });
    }
    h+='</div></div></div>';
    return h;
}

//以下为机构-------------------------------------------------------------------------------------------------------------
//添加机构
function neworgan(og){
    var t = $("#tbau").val();
    $.post('/saveorgan',{au:t,og:og},function(data,text){
        if(data){
            alert(data);
        }
        else{
            var $me = $(".au_og_list");
            $('<div class="au_organ"><span class="au_og_tm">0</span>,<span class="au_og_nm">'+og+'</span><img src="/images/del.png" class="au_del_organ" /></div>').appendTo($me);
        }
    });
}
//删除机构
function delorgan(tm,og,$me)
{
    var name = $("#tbau").val();
    $.post('/delorgan',{name:name,tm:tm,og:og},function(err){
        console.log(err);
        if(err){
            alert(err);
        }
        else{
            $me.parent().hide();
        }
    });
}
//编辑机构的时间
function editorgantime(newtime)
{
    var name = $("#tbau").val();
    if($organtime && newtime){
        var og = $organtime.next().text();
        var tm = $organtime.text();
        $.post('/editorgantime',{name:name,tm:tm,og:og,ntm:newtime},function(data,text){
            if(data){
            }
            else{
                $organtime.text(newtime);
                $organtime = undefined;
                newtime = undefined;
                $("#floattimebox").hide();
            }
        })
    }

}