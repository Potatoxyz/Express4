var showAlert = function (mes) {
    var html = '<div class="alert-modal animated bounceIn" id="alert">\n' +
        '    <div class="alert-close"><i class="glyphicon glyphicon-remove alert-close-icon"></i></div>\n' +
        '    <div class="alert-title">\n' +
        '        <div class="alert-type">\n' +
        '            <i class="glyphicon glyphicon-question-sign alert-icon"></i>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="alert-body">\n' +
        '        <div class="alert-message">\n' +
        '            <p class="message"></p>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="alert-footer">\n' +
        '        <button class="btn btn-sm btn-primary alert-confirm-btn">确定</button>\n' +
        '        <button class="btn btn-sm btn-warning alert-cancel-btn">取消</button>\n' +
        '    </div>\n' +
        '</div>';
    var blackBg = '<div class="screen" id="screen"></div>';
    var result=false;
    $(blackBg).prependTo('body');
    $('#screen').css({
        position: 'fixed',
        top: '0',
        minWidth: '100vw',
        minHeight: '100vh',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,.5)',
        zIndex: '1000'
    });
    $(html).prependTo('body');
    $('#alert').find('.message').text(mes);
    $('#alert').css({
        position: 'fixed',
        overflow: 'hidden',
        width: '400px',
        minHeight: '350px',
        height: 'auto',
        zIndex: '1001',
        left: '50%',
        marginLeft: '-200px',
        top: '50%',
        marginTop: '-175px',
        background: 'white',
        color: 'black',
        textAlign: 'center',
        borderRadius: '8px',
        boxShadow: '0 2px 10px 2px rgba(0,0,0,0.6)',
        border: '1px solid white',
        fontSize: '16px'
    });
    $('#alert').find('.alert-close').css({
        textAlign: 'right',
        padding: '10px'
    });
    $('#alert').find('.alert-icon').css({
        cursor: 'default'
    });
    $('#alert').find('.alert-title').css({
        fontSize: '5em'
    });
    $('#alert').find('.alert-body').css({
        minHeight: '130px',
        padding: '10px',
        overflowY: 'hidden',
        overflowX: 'scroll'
    });
    $('#alert').find('.alert-confirm-btn').css({marginRight: '20px'});
    $('#alert').find('.alert-footer').children('button').css({
        padding: '8px 15px',
        fontSize: '1em'
    });
    //阻止冒泡,实现阻止rightBar关闭
    $('#alert').click(function (e) {
        e.stopPropagation();
    });
    return new Promise(function (resolve, reject) {
        $('#alert').find('.alert-confirm-btn').click(function () {
            closeAlert('confirm');
            resolve(true);
        });
        $('#alert').find('.alert-cancel-btn').click(function () {
            closeAlert();
            resolve(false);
        });
        $('#alert').find('.alert-close-icon').click(function () {
            closeAlert();
            resolve(false);
        });
    });
};
var closeAlert = function (confirm) {
    if(confirm){
        $('#alert').removeClass('bounceIn').addClass('bounceOut');
    }
    else{
        $('#alert').removeClass('bounceIn').addClass('fadeOut');
    }
    setTimeout(function () {
        $('#alert').remove();
        $('#screen').remove();
    }, 1000)
};