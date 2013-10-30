$(function(){
    $("#btndel").click(function(){
        var name = $("#name").text();
        console.log(name);
        $.post('/del/author/'+name,{},function(data,text){
            if(data!='ok'){
                $("#lbmsg").text(data);
            }
            else{
                $("#ret").show();
            }
        });
    });
});