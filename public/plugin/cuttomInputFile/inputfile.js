function  initInputFile(){
    $("input[type=file]").change(function(){$(this).parents(".uploader").find(".filename").val($(this).val());});
    $("input[type=file]").each(function(){
        if($(this).val()==""){$(this).parents(".uploader").find(".filename").val("No file selected...");}
    });
}
//template

// <div class="uploader black">
// <input type="text" class="filename" readonly/>
// <input type="button" name="file" class="button" value="Browse..."/> +
// <input type="file" size="30"/>
// </div>