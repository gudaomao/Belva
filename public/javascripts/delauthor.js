$(function(){
    $(".btn-danger").click(function(){
        var id = $("#hdid").val();
        if(id){
            $.post('/del/'+id,{id:id},function(data,status){
                if(!data){
                    window.location.href='/aulist';
                }
                else{
                    alert(data);
                }
            });
        }
        else
        {
            alert('没有发现要删除的学者的id');
        }
    });
    $(".btn-default").click(function(){
        history.back();
    });
})