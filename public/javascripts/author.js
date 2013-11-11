$(function(){
    $(".add").click(function(){
        var s = $(this).parent().next().children();
        var $t = null;
        for(var i=0;i< s.length;i++)
        {
            if($(s).hasClass('addattr')){
                //$(s).show();
                $t = $(s);
                break;
            }
        }
        if($t){
            $t.toggle();
        }
    });

    $(".cancel").click(function(){
        if($(this).parent().parent().hasClass('addattr')){
            $(this).parent().parent().hide();
        }
        else{
            if($(this).parent().parent().parent().hasClass('addattr')){
                $(this).parent().parent().parent().hide();
            }
        }
    });
    $(".alert").hover(function(){
        $(this).css("background","#f0f0f0");
        var s = $(this).children();
        for(var i=0;i< s.length;i++){
            if($(s[i]).hasClass('close')){
                $(s[i]).show();
                break;
            }
        }
    },function(){
        $(this).css("background","#ffffff");
        var s = $(this).children();
        for(var i=0;i<s.length;i++){
            if($(s[i]).hasClass('close')){
                $(s[i]).hide();
                break;
            }
        }
    });
    $("#returntolist").hover(function(){
        $(this).attr("src","/images/arrow-leftb.svg");
    },function(){
        $(this).attr("src","/images/arrow-left.svg");
    });
    $("#delauthor").hover(function(){
        $(this).attr("src","/images/removeb.svg");
    },function(){
        $(this).attr("src","/images/remove.svg");
    });
});
function delattr(aid,doc){
    $.post('/delattr',{aid:aid,doc:doc},function(err,status){
        if(err){
            alert(err);
        }
        else{
            window.location.reload();
        }
    });
}
function addattr(aid,doc){
    $.post('/addattr',{aid:aid,doc:doc},function(err,status){
        if(err){
            alert(err);
        }
        else{
            window.location.reload();
        }
    });
}
function delauthor(){
    var auid = $("#auid").val();
    var auname = $("#auname").text();
    $.get('/del',{id:auid,name:auname},function(data,status){});
}
