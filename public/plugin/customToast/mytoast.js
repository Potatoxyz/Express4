function showToast(container,message) {
    var dom=$('<div id="toast" class="toast mybg-error animated bounceIn">\n' +
        '        <p></p>\n' +
        '        <button type="button" id="close-toast" class="close" aria-label="Close">\n' +
        '            <span class="black-text" aria-hidden="true">&times;</span>\n' +
        '        </button>\n' +
        '    </div>').appendTo(container);
    (dom)[0].style.cssText+='position: absolute;\n' +
        '    z-index: 1000;\n' +
        '    top:50px;\n' +
        '    left: 50%;\n' +
        '    margin-left: -180px;\n' +
        '    width: 360px;\n' +
        '    height: 50px;\n' +
        '    border-radius: 10px;\n' +
        '    color: white;';
    (dom.children('p'))[0].style.cssText+='    font-size: 20px;\n' +
        '    color: white;\n' +
        '    text-align: center;\n' +
        '    margin-bottom: 0;\n' +
        '    height: 100%;\n' +
        '    line-height: 50px';
    (dom.children('.close'))[0].style.cssText+=' position: absolute;\n' +
        '    top:5px;\n' +
        '    right: 5px;\n' +
        '    font-size: 25px;';
    (dom.children('p'))[0].innerText=message;
    dom.children('button').click(function () {
        closeToast();
    });
    $('#toast').click(function (e) {
        e.stopPropagation();
    })
}
function closeToast() {
    $('#toast').removeClass('bounceIn').addClass('fadeOut');
    setTimeout(function () {
        $('#toast').remove();
    },2000)
}