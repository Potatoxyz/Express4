var rightBar=$('#rightBar');
$(rightBar).click(function (e) {
    e.stopPropagation();
});
var toggleBar=function () {
    var rightFun=$('#rightFun');
    var isopenleftBar=false;
    var leftBar=$('#leftBar');
    var sideBar=$('#sideBar');
    var closeRightFun=$('#closeRightFun');
    $(rightFun).click(function (e) {
        e.stopPropagation();
        showrightBar();
    });
    $(closeRightFun).click(function (e) {
        e.stopPropagation();
        hiddenRightbar();
    });
    $(leftBar).click(function () {
        if(!isopenleftBar){
            $(sideBar).addClass('toggleSideBar');
            $(leftBar).addClass('bg-black');
            isopenleftBar=true;
        }
        else{
            $(sideBar).removeClass('toggleSideBar');
            $(leftBar).removeClass('bg-black');
            isopenleftBar=false;
        }
    })
};
var showrightBar=function () {
    $(rightBar).removeClass('toggleRightBar');
};
var hiddenRightbar=function () {
    $(rightBar).addClass('toggleRightBar');
};
$('body').click(function () {
    if(!$(rightBar).hasClass('toggleRightBar')){
        hiddenRightbar();
    }
});
//初始化左右两边的bar切换
toggleBar();