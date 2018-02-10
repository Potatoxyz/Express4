var removeItem=function (_this,_callback) {
    _this.css('position','relative')
        .animate(
            {
                left:'-100%'
            },
            {
                duration:500,
                complete:function () {
                    $(this).remove();
                    if(_callback){
                        _callback();
                    }
                }
            }
        );
};