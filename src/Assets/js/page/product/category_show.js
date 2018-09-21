$(function(){
    var datas=$(".orgs-data").text() !=""?JSON.parse($(".orgs-data").text()):"";
    function cateShow(datas){
        if(datas && datas.length >0){
            for(var i=0 ; i<datas.length; i++){
                var data=datas[i];

                var html='<tr class="category-list"  data-node_level="'+ data.node_level
                    +'" data-node_left_hander="'+data.node_left_hander
                    +'" data-node_right_hander="'+data.node_right_hander
                    +'" data-node_id="'+ data.node_id
                    +'" data-node_name="'+ data.node_name+'">'
                    +'<td style="padding-left:'+30*data.node_level+'px;">'
                    + '<i class="icon-gift"></i> '+data.node_name+'</td>'
                    +'<td>'
                    +'<a href="javascript:void(0);" class="btn-add-subcategory">添加子分类</a>'
                    +'<a href="javascript:void(0);" class="btn-edit-subcategory">编辑</a>'
                    +'<a href="javascript:void(0);" class="btn-del-subcategory">删除</a>'
                    +'</td></tr> ';

                $(".orgs-list").append(html);

                if(data.sub_categories && data.sub_categories.length >0){

                    cateShow(data.sub_categories)
                };
            };

        }else{
            $(".orgs-list").append('<tr><td colspan="2" class="center">还没有数据哦</td></tr>');
        };
    };

    cateShow(datas);




    /**
     * 添加分类
     * @param {*事件触发源}$self
     * @param {*用来区分添加同级分类（0）和添加子级分类（1）}$tag
     */
    function AddSubcategory(self,$tag,url){
        clearFromData("#addCategory");
        showModal("#addCategory","添加");

        var $tdParent = self.parents(".category-list");
        var $nodeName=$tdParent.attr("data-node_name");
        var $nodeLevel=$tdParent.attr("data-node_level");

        $("#addCategory .sup-cate").remove();

        if($tag==1){//分类层级 如果层级大于1 在添加分类的弹窗内插入上一级分类的名称
            pependSubNodeName($nodeName,"#addCategory .cate-form");

        };

        //确认添加分类
        $(".btn-confirm").unbind("click").bind("click",url,function(){

            var confirmSelf=$(this);
            $(".cate-name").trigger("blur");

            if($(".form-notice").length > 0){
                return false;

            }else{

                if($tag=='0'){//同级别
                    var $nodeId='1';

                }else if($tag=='1'){//子级别
                    var $nodeId = $tdParent.attr("data-node_id");

                };

                var $nodeName=$(".cate-name").val();

                var data={
                    node_id : $nodeId,
                    node_name : $nodeName,
                };

                $(this).attr("disabled","disabled");
                ajaxRequest(url,'POST',data,function(res){
                    if(typeof res == 'string'){
                        res = JSON.parse(res);
                    };
                    alert(res.info.join('\n'));
                    window.location.reload();

                },ajaxError,self,confirmSelf);
            };

        });

        //如果限定级别
        // if($nodeLevel>=3){
        //     showModal("#noticeModal","操作提示","最多只能添加三级分类哦");
        // }else{
        //    ajaxRequest(url,'POST',data,AddSubSuccess,ajaxError);
        // }
    };




    /**
     * 编辑分类
     * @param {*事件触发源}$self
     */
    function EditSubcatagory($self,getUrl,url){

        //获取当前节点的id 发ajax 填充数据 名称 上一级名称 图片
        clearFromData("#addCategory");

        var $tdParent=$self.parents("tr");
        var $nodeId=$tdParent.attr("data-node_id");

        var data={node_id : $nodeId};

        ajaxRequest(getUrl,'GET',data,EditCateGetDataSuccess,ajaxError);

        $(".btn-confirm").unbind("click").bind("click",url,function(){

            var confirmSelf=$(this);
            $(".cate-name").trigger("blur");

            if($(".form-notice").length > 0){
                return false;

            }else{

                var $nodeId = $tdParent.attr("data-node_id");
                var $nodeName=$(".cate-name").val();
                var data={
                    node_id:$nodeId,
                    node_name:$nodeName,
                };

                $(this).attr("disabled","disabled");
                ajaxRequest(url,'POST',data,EditCateSuccess,ajaxError,$self,confirmSelf);
            };

        });
    };

    //点击编辑时获取数据成功
    function EditCateGetDataSuccess(res){

        var $nodeData=res.data.node;
        var $nodeLevel=$nodeData.organization_level;

        $("#addCategory .sup-cate").remove();

        // if($nodeLevel>1){//分类层级 如果层级大于1 插入上一级分类
        var $prsNodeName=$nodeData.parent_node.category_name;
        pependSubNodeName($prsNodeName,"#addCategory .cate-form");
        // };

        //填充数据
        $(".cate-name").val($nodeData.category_name);
        showModal("#addCategory","编辑");
    };



    //编辑成功
    function EditCateSuccess(res,$self){

        alert("编辑成功");
        window.location.reload();
    };


    /**
     * 删除分类
     * @param {*事件触发源}$self
     */
    function Delcategory($self,url){
        var $tdParent=$self.parents("tr");
        var $nodeId = $tdParent.attr("data-node_id");
        var $nodeName = $tdParent.attr("data-node_name");

        showModal("#confirmModal","删除","确认删除 “"+$nodeName+"” 分类吗？");

        $(".btn-confirm").unbind("click").bind("click",function(){

            var confirmSelf=$(this);

            $(this).attr("disabled","disabled");
            var data={node_id : $nodeId};
            ajaxRequest(url,'POST',data,delCateSuccess,ajaxError,$self,confirmSelf);

        });
    };

    //删除分类成功
    function delCateSuccess(res){
        alert(res.info.join('\n'));
        window.location.reload();
    };
    //ajax请求失败
    function ajaxError(res){
        console.log(res);
        // alert(res.info.join('\n'));
    };


    /**
     * 添加上级分类的名称
     * @param {*上级分类的名称}$nodeName
     * @param {*插入上级分类的节点}prsEle
     */
    function pependSubNodeName($nodeName,prsEle){//上级分类的名称
        var supNodeHtml= '<div class="sup-cate">\
                              <p class="">上一级分类：'+$nodeName+'</p>\
                              </div>';

        $(prsEle).prepend(supNodeHtml);
    };


    /**
     * 事件触发调用函数
     * @param {*事件触发源}$self
     */

    //验证表单
    $(".cate-name").unbind("keyup blur").bind('keyup blur',function(){
        var self=$(this);
        var val=self.val();
        if(val=="" || val==undefined){
            noticeText(self,false,"必填字段不能为空");
        }else{
            noticeText(self,true,"");
        }
    });

    //添加子分类
    $(".btn-add-subcategory").unbind("click").bind("click",function(){
        var $self=$(this);
        AddSubcategory($self,1,'/shop/product/api/category/add');
    });

    //添加同级分类
    $(".btn-add").unbind("click").bind("click",function(){
        var $self=$(this);
        AddSubcategory($self,0,'/shop/product/api/category/add');
    });

    //编辑
    $(".btn-edit-subcategory").unbind("click").bind("click",function(){
        var $self=$(this);
        EditSubcatagory($self,'','/shop/product/api/category/edit');
    });

    //删除
    $(".btn-del-subcategory").unbind("click").bind("click",function(){
        var $self=$(this);
        Delcategory($self,'/shop/product/api/category/delete');
    });


});