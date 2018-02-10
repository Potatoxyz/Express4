var rightBarInner=function () {
    var tab1content=$('#tab1-content');
    var tab2content=$('#tab2-content');
    var tab3content=$('#tab3-content');
    var selectedTab=$("input[name='tab']");
    $(selectedTab).click(function () {
        var selectedTabValue=$(this).val();
        if(selectedTabValue==='tab1'){
            $(tab1content).css('left','0');
            $(tab2content).css('left','100%');
            $(tab3content).css('left','200%');
        }
        if(selectedTabValue==='tab2'){
            $(tab1content).css('left','-100%');
            $(tab2content).css('left','0');
            $(tab3content).css('left','100%');
        }
        if(selectedTabValue==='tab3'){
            $(tab1content).css('left','-200%');
            $(tab2content).css('left','-100%');
            $(tab3content).css('left','0');
        }
    })
};
//rightBar内部tab切换
rightBarInner();