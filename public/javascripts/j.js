$(function(){
    $("#tbau").change(function(){
        console.log('search author:');
        var t = $.trim($(this).val());
        if(t!=""){
            getauthor(t);
        }
    });
    $("#btnsave").click(function(){
        newauthor();
    });
    $(document).on('click','.au_new_organ',function(){
        var memog = window.bound.getMemText();
        neworgan(memog);
    }).on('click','.au_del_organ',function(e){
            var $me = $(e.target);
            var og = $me.prev().text();
            var yr = $me.prev().prev().text();
            delorgan(yr,og,$me);
        });
});
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
            h+='<div class="au_organ"><span class="au_og_tm">'+xtm+'</span>,<span class="au_og_nm">'+xog+'</span><img src="/images/del.png" class="au_del_organ" /></div>';
        });
    }
    h+='</div></div></div>';
    return h;
}

function neworgan(og){
    var t = $("#tbau").val();
    $.post('/saveorgan',{au:t,og:og},function(data,text){
        if(data){
            alert(data);
        }
        else{
            var $me = $(".au_text");
            $('<div class="au_organ">0, '+og+'</div>').appendTo($me);
        }
    });
}
function delorgan(yr,og,$me)
{
    var name = $("#tbau").val();
    $.post('/delorgan',{name:name,yr:yr,og:og},function(err){
        console.log(err);
        if(err){
            alert(err);
        }
        else{
            $me.parent().hide();
        }
    });
}