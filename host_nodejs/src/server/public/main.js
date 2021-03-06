var app = function(w,d, $){

var me = {};

$(function(){

    var msgForm = comps.msgForm($('#sendMessageForm'));
    var messageListComp = comps.messageList( $('#messageList') );
    $autorefresh = $("#autorefreshCB");
    
    $("#refreshMessageList").click(()=>{
        $.ajax({
            'url': '/service/get_messages',
            method: 'GET'
        }).done( (list)=> {
            messageListComp.setList(list);
        });
    }).click();

    $("#clearMessagesBtn").click(()=>{
        $.ajax({
            'url': '/service/clear_log',
            method: 'GET'
        }).done( (done) => {
            console.log('log', done);
            $("#refreshMessageList").click();
        });
    });
    setInterval(()=>{
        if($autorefresh.is(":checked")){
            $("#refreshMessageList").click();
        }
    }, 5000);
});


var comps = {};

comps.msgForm = function($box){
    var comp = {};
    
    $($box).find("button[type=submit]").click(submitSendMessage);

    function submitSendMessage(){
        var message = $($box).find("input[name=message]").val();
        $.ajax({
            url: '/service/send_message',
            data: {message: message},
            dataType: 'json',
            method: 'POST',

        }).done(function(data){
            console.log("data:", data);
        });
    }

    return comp;
};

comps.messageList = function($table){
    let comp = {};
    const $tbody = $table.find("tbody");

    comp.setList = list => {
        $tbody.empty();
        list.forEach(item => {
            $tbody.append(
                $("<tr>")
                .append($('<td>').text(item.host) )
                .append($('<td>').text(item.message) )
                .append($('<td>').text(item.queue) )
                .append($('<td>').text(item.date) )
            );
        });
    };

    return comp;
};

return me;

}(window, document, jQuery);