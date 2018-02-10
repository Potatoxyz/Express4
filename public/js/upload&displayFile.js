//1.右侧PDF页面第一次加载时获取文件夹及其子文件
//1-1.默认文件夹不可删除
//1-2.文件dom绑定展开和编辑事件
//1-3.添加文件夹
//1-4.删除文件夹
//2.右侧上传获取文件夹选项
//3.双击文件夹，播放该文件图片，同时子文件绑定锚点

var wraper = $('#tab1-content ul.file-list');
var firstdom = $('#tab1-content ul.file-list li.list-item:first-of-type');

//给一个文件夹绑定双击打开图片，给其子文件绑定锚点
var playpic=function (toOpenfile) {
    var anchors=[];
    var playPic=$('#playPic');
    console.log(toOpenfile);
    $.ajax({
        url:'http://localhost:8080/server/getPic',
        type:'GET',
        data:{data:toOpenfile},
        error:function (err) {
            console.log(err);
        },
        success:function (res) {
            var srcs=[];
            console.log(res);
            if(res.result){
                res.data.forEach(function (currentValue,index) {
                    anchors.push('Pic'+index);
                    srcs.push(currentValue);
                });
                $(playPic)[0].contentWindow.initPage(anchors,srcs);
            }
            else{
                showToast($('body'),res.message);
                setTimeout(function () {
                    closeToast();
                },5000)
            }
        }
    });
};
var bindPlayPic=function (item) {
    var targetfile=$(item).find('.filenametext').text();
    //console.log(targetfile);
    if(targetfile==='默认文件夹'){
        targetfile='default';
    }
    $(item).bind('dblclick',function (e) {
        playpic(targetfile);
    });
    $(item).bind('touchstart',function (e) {
        var evtarget=e.target.tagName.toLowerCase();
        if(evtarget!=='i'){
            playpic(targetfile);
        }
    })
};

//查看子文件,传入的参数是 文件夹图标的父元素
var bindopenfile = function (_toggleopen) {
    var open = false;
    $(_toggleopen).click(function (e) {
        e.stopPropagation();
        if (!open) {
            $(this).parents('li').next().slideDown();
            open = !open;
        }
        else {
            $(this).parents('li').next().slideUp();
            open = !open;
        }
    })
};

//编辑文件夹名,传入的参数是 编辑图标的父元素，和确认图标的父元素
var editfilename = function (_edit, _confirmedit) {
    var toggle = function (arr) {
        $.each(arr, function (index, value) {
            $(value).toggle();
        });
    };
    var text = $(_edit).siblings('p.filename-display-box').children('.filenametext');
    var input = $(_edit).siblings('p.filename-display-box').children('.filenameinput');
    $(input).children('input').bind('keypress', function (e) {
        if (e.keyCode === 13) {
            $(_confirmedit).trigger('click');
        }
    });
    $(_edit).click(function (e) {
        e.stopPropagation();
        toggle([text, input, this, _confirmedit]);
        $($(input).children('input'))[0].focus();
    });
    $(_confirmedit).click(function (e) {
        e.stopPropagation();
        toggle([text, input, this, _edit]);
        var inputvalue = $(input).children('input').val();
        var beforetext = $(text).text();
        if (inputvalue !== '') {
            $(input).children('input').val('');
            updatefileoptions();
            $.ajax({
                url:'http://localhost:8080/server/editfile',
                type:'POST',
                data:{beforetext: beforetext,aftertext: inputvalue},
                error:function () {
                    showToast($('#rightBar'),'网络错误');
                    setTimeout(function () {
                        closeToast();
                    },2000);
                },
                success:function (res) {
                    console.log(res);
                    if(res==='修改成功'){
                        $(text).text(inputvalue);
                        updatefileoptions();
                    }
                    if(res==='修改失败'){
                        showToast($('#rightBar'),res);
                        setTimeout(function () {
                            closeToast();
                        },2000);
                    }
                }
            });
        }
    })
};

//添加文件夹
var filecode;
var addFliebox = $('#addFliebox');
var addFile = function () {
    var newfiletext = '新建文件夹(' + filecode + ')';
    $.ajax({
        url:'http://localhost:8080/server/addfile',
        type:'POST',
        data:{filename:newfiletext},
        error:function () {
            showToast($('#rightBar'),'网络错误');
        },
        success:function (res) {
            console.log(res);
            if(res==='添加成功'){
                var addnewdom = $(firstdom).clone();
                var fileicon = $(addnewdom).find('.file-icon');
                var editicon = $(addnewdom).find('.editicon').removeClass('none');
                var confirmediticon = $(addnewdom).find('.confirmediticon');
                $(addnewdom).find('.filenametext').text(newfiletext);
                $(addnewdom).appendTo($(wraper));
                bindopenfile(fileicon);
                editfilename(editicon, confirmediticon);
                $(editicon).trigger('click');
                updatefileoptions();
            }
            else{
                showToast($('#rightBar'),res);
            }
        }
    });


};
$(addFliebox).click(function (e) {
    e.stopPropagation();
    addFile();
});
//删除文件夹
var deleteFileBox = $('#deleteFileBox');
var dodelete = $('#dodelete');
var delfuc=function (data,todelArr) {
    $.ajax({
        url:'http://localhost:8080/server/deletefile',
        type:'POST',
        data:data,
        processData :false,
        error:function () {
            showToast($('#rightBar'),'网络错误');
        },
        success:function (res) {
            console.log(res);
            if(res.result){
                todelArr.forEach(function (value) {
                    var listitems=$('#tab1-content .file-list .list-item');
                    listitems.each(function (index, el) {
                        if(value===$(el).find('.filenametext').text()){
                            removeItem($(el), updatefileoptions);
                        }
                    })
                });
            }
            else{
                showToast($('#rightBar'),res.message);
                setTimeout(function () {
                    closeToast();
                },2000);
            }
        }
    });
};
$(deleteFileBox).click(function () {
    $('#tab1-content ul li.list-item').each(function (index) {
        $($('#tab1-content ul li.list-item')[index]).find("input[type='checkbox']").removeAttr('disabled');
        $($('#tab1-content ul li.list-item')[index]).find(".custom-checkbox").css('cursor', 'default');
    });
    $($('#tab1-content ul li.list-item')[0]).find("input[type='checkbox']").attr('disabled', 'true');
    $($('#tab1-content ul li.list-item')[0]).find(".custom-checkbox").css('cursor', 'not-allowed');
    $('#tab1-content .file-list .checkbox-wrap').toggle();
    $(this).toggle();
    $(dodelete).toggle();
});
$(dodelete).click(function () {
    var check = $("#tab1-content ul li.list-item .checkbox-wrap");
    var notemptyfileList=[];
    var emptyfile=[];
    $(check).each(function (index) {
        if ($(this).find('input').prop('checked')) {
            var targetname=$(this).next('.file-list-item').find('.filenametext').text();
            console.log(filesmock);
            $.each(filesmock,function (index,value) {
                if(value.filename===targetname){
                    //console.log(targetname);
                    if(value.subfiles.length>0){
                        notemptyfileList.push(targetname);
                    }
                    else{
                        emptyfile.push(targetname);
                    }
                }
            })
        }
    });
    //不管是确定还是取消删除，把checkbox勾选状态还原
    $(check).each(function (index) {
        var input=$(this).find('input');
        input[0].checked=false;
    });
    if(notemptyfileList.length>0){
        var result=showAlert(notemptyfileList.join()+'不是空文件夹，确定删除？');
        result.then(function (d) {
            console.log(notemptyfileList.join());
            var data=notemptyfileList.join();
            if(d){
                delfuc(data,notemptyfileList);
            }
        });
    }
    if(emptyfile.length>0){
        var data=emptyfile.join();
        delfuc(data,emptyfile);
    }
    $('#tab1-content .file-list .checkbox-wrap').toggle();
    $(this).toggle();
    $(deleteFileBox).toggle();
});
//根据左边的文件夹更新上传选择文件option,keepValue是上传成功之后，选项不变
var updatefileoptions = function (keepvalue) {
    console.log('更新上传option');
    var lis = $(wraper).children('li.list-item');
    var select = $('#filesSelect');
    $(select).children('option').remove();
    $(select).append('<option value="_choice">请选择文件夹</option>');
    $.each(lis, function (index, value) {
        var text = $(value).find('.filenametext').text();
        $(select).append('<option value=' + text + '>' + text + '</option>');
    });
    if(keepvalue){
        $(select).val(keepvalue);
    }
};

//获取服务端文件夹
var filesmock;
var updateAllFiles=function (keepfileoption) {
    $.ajax({
        url: 'http://localhost:8080/server/filesList',
        type: 'GET',
        error: function () {
            console.log('网络连接错误');
            showToast($('body'), '网络连接错误');
        },
        success: function (res) {
            filecode=res.length+1;
            filesmock = res;
            var existfilenames=$('#tab1-content .file-list .list-item');
            $.each(existfilenames,function (index) {
                if(index!==0){
                    $(existfilenames[index]).remove();
                }
            });
            console.log(res);
            var subfileshtmltext = "<li class=\"files-detail mb15\" style='display: none;'>\n" +
                "                <div class=\"files-detail-icon\">\n" +
                "                    <i class=\"glyphicon glyphicon-hand-down fa-1-5x\"></i>\n" +
                "                </div>\n" +
                "                <ul class=\"sigle-file-wrap\"></ul>\n" +
                "            </li>";
            //根据返回数据初始化文件夹
            $.each(filesmock, function (index, value) {
                if (value.filename === 'default') {
                    var fileicon = $(firstdom).find('.file-icon');
                    var editicon = $(firstdom).find('.editicon').addClass('none');
                    $(firstdom).after(subfileshtmltext);
                    $.each(value.subfiles, function (index1, value1) {
                        $(firstdom).next().find('.sigle-file-wrap').append("<li class='text-center'>" + value1 + "</li>");
                    });
                    //绑定展开子文件
                    bindopenfile(fileicon);
                    bindPlayPic(firstdom);
                }
                else {
                    var newfilesdom = $(firstdom).clone();
                    var otherfileicon = $(newfilesdom).find('.file-icon');
                    var otherediticon = $(newfilesdom).find('.editicon').removeClass('none');
                    var otherconfirmediticon = $(newfilesdom).find('.confirmediticon');
                    $(newfilesdom).find('.filenametext').text(value.filename);
                    $(wraper).append(newfilesdom);
                    $(newfilesdom).after(subfileshtmltext);
                    $.each(value.subfiles, function (index2, value2) {
                        $(newfilesdom).next().find('.sigle-file-wrap').append("<li class='text-center'>" + value2 + "</li>");
                    });
                    //绑定展开子文件
                    bindopenfile(otherfileicon);
                    //绑定编辑文件夹名
                    editfilename(otherediticon, otherconfirmediticon);
                    bindPlayPic(newfilesdom);
                }
            });
            //初始化上传文件的option
            if(keepfileoption){
                updatefileoptions(keepfileoption);
            }
            else{
                updatefileoptions();
            }
        }
    });
};



//文件上传
//上传之前判断对应的文件夹有没有选择
var checkFileWraper=function () {
    var selectedFilesWrap = $('#filesSelect').val();
    if (selectedFilesWrap === '_choice' || !selectedFilesWrap) {
        showToast($('#rightBar'), '请选择目标文件夹');
        setTimeout(function () {
            closeToast();
        }, 2000);
        return false;
    }
    else{
        return true;
    }
};
var previewId = 1;
var submitAll = $('#submitAll');
var formdata = new FormData();
var filesname = [];
$(submitAll).click(function (e) {
    var selectedFilesWrap = $('#filesSelect').val();

//            $.each(filesname,function (index) {
//              console.log(formdata.getAll(filesname[index]));
//            });

    console.log('文件个数：' + filesname.length);

    if (filesname.length > 0) {
        console.log('提交');

        if(checkFileWraper()){
            $.ajax({
                url: 'http://localhost:8080/server/targetFile',
                type: 'POST',
                data: {targetFile: selectedFilesWrap},
                success: function (res) {
                    console.log(res);
                    //先判断文件夹有没有问题，再提交进行文件上传
                    $.ajax({
                        url: 'http://localhost:8080/server/upload',
                        type: 'POST',
                        processData: false,  // 不处理数据，默认情况下，为了配合application/x-www-urlencoded,会把data转换成查询字符串
                        contentType: false,   // 不设置内容类型
                        data: formdata,
                        error: function (err) {
                            console.log(err);
                        },
                        success: function (res) {
                            console.log(res);
                            //上传成功后清空formData,和filename
                            $.each(filesname, function (index) {
                                formdata.delete(filesname[index]);
                                //console.log(formdata.getAll(filesname[index]));
                            });
                            filesname = [];
                            $('#tab2-content .info-wrap .upload-item').find('.mybg-primary')
                                .text('')
                                .addClass('glyphicon glyphicon-ok')
                                .unbind('click');
                            $('#tab2-content .info-wrap .upload-item').find('.mybg-primary').next().text('关闭');

                            //把进度条样式还原
                            $('#progress .progress-bar').css('width', '0%');

                            //更新文件夹视图,参数文件上传之后选择的文件夹
                            updateAllFiles(selectedFilesWrap);
                        },
                        xhr: function () {
                            var xhr = $.ajaxSettings.xhr();
                            if (xhr.upload) {
                                $('#progress').removeClass('none');
                                xhr.upload.addEventListener('progress', function (e) {
                                    percentage = parseInt(e.loaded / e.total * 100);
                                    $('#progress .progress-bar').css(
                                        'width',
                                        percentage + '%'
                                    );
                                    if (percentage === 100) {
                                        $('#progress').addClass('none');
                                    }
                                })
                            }
                            return xhr;
                        }
                    })


                },
                error: function (res) {
                    console.log(res);
                }
            });
        }
    }
    else {
        showToast($('#rightBar'), '请先选择图片!');
        setTimeout(function () {
            closeToast();
        }, 2000);
        return false;
    }

});
$('#fileupload').fileupload({
    url: 'http://localhost:8080/server/upload',

    //进度条
    progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css(
            'width',
            progress + '%'
        );
        if (progress === 100) {
            $('#progress').addClass('none');
        }
    },
    //上传结果
    done: function (e, data) {
        var selectedFilesWrap = $('#filesSelect').val();
        console.log(data.result);
        //单个上传成功后，把对应的filesname和formdata删除，
        var index = filesname.indexOf(data.files[0].name);
        if (index !== -1) {
            filesname.splice(index, 1);
            formdata.delete(filesname[index]);
        }
        console.log(filesname);

        //item操作相对应修改
        var target = $(data.context).text('')
            .addClass('glyphicon glyphicon-ok')
            .unbind('click');
        target.next().text('关闭');

        //把进度条样式还原
        $('#progress .progress-bar').css('width', '0%');

        //更新子文件夹视图
        updateAllFiles(selectedFilesWrap);
    },
    fail: function (e, data) {
        $(data.context).text('')
            .removeClass('mybg-primary')
            .addClass('glyphicon glyphicon-remove mybg-error')
            .unbind('click');
        showToast($('#rightBar'), '网络错误！');
        setTimeout(function () {
            closeToast();
        }, 3000)
    },
    add: function (e, data) {
        var filesize;
        var unit;
        var fileName = data.files[0].name;
        var s1 = data.files[0].size / 1024;
        var s2 = data.files[0].size / 1024 / 1024;
        if (s1 < 1024) {
            filesize = s1.toFixed(2);
            unit = 'KB';
        }
        if (s1 > 1024) {
            filesize = s2.toFixed(2);
            unit = 'M';
        }


        //选择文件时去重
        var files = formdata.getAll(data.files[0].name);
        //console.log(data.files[0]);
        //console.log(data.files[0].name);
        if (files.length === 0) {
            formdata.append(data.files[0].name, data.files[0]);
            filesname.push(data.files[0].name);
        }
        else {
            showToast($('#rightBar'), '不能导入相同的文件:' + data.files[0].name);
            setTimeout(function () {
                closeToast();
            }, 2000);
            return false;
        }


        loadImage(
            data.files[0],
            function (img) {
                $('#preview-title').removeClass('none');
                $('#tab2-content .info-wrap').append('<div class="upload-item animated" id=' + previewId + '>\n' +
                    '                    <span class="preview-img"></span>\n' +
                    '                    <span class="file-detail"></span>\n' +
                    '                    <span class="file-action"></span>\n' +
                    '                </div>');
                $('#' + previewId + ' ' + '.preview-img').append(img);
                $('#' + previewId + ' ' + '.file-detail').append('<i class="size">' + fileName + '</i>');
                $('#' + previewId + ' ' + '.file-detail').append('<i class="fileName">' + filesize + ' ' + unit + '</i>');
                $('<a href="javascript:;" class="mybg-primary">上传</a>').appendTo($('#' + previewId + ' ' + '.file-action'))
                    .click(function () {
                        data.context = $(this);
                        $('#progress').removeClass('none');
                        if(checkFileWraper()){
                            var selectedFilesWrap = $('#filesSelect').val();
                            $.ajax({
                                url: 'http://localhost:8080/server/targetFile',
                                type: 'POST',
                                data: {targetFile: selectedFilesWrap},
                                error:function () {},
                                success:function (res) {
                                    console.log(res);
                                    data.submit();
                                }
                            });
                        }
                        else{
                            $('#progress').addClass('none');
                        }
                    });
                $('<a href="javascript:;" class="mybg-warning">取消</a>').appendTo($('#' + previewId + ' ' + '.file-action'))
                    .click(function () {
                        //dom移除
                        removeItem($(this).parents('.upload-item'));
                        //
                        formdata.delete(data.files[0].name);
                        //filesname移除
                        if ($(this).text() === '取消') {
                            var index = filesname.indexOf(data.files[0].name);
                            if (index !== -1) {
                                filesname.splice(index, 1);
                            }
                        }
                    });
                previewId++;
            },
            {maxWidth: 70}
        );
    }
});