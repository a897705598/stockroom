$(function(){
    /*old*/
    /*//无限分类
    var datas =$("#dataNode-selectCateProduct").find(".datas").text();

    datas = JSON.parse(datas);
    //定义渲染函数
    var sortUl = $(".productsort-ul");
    if(!sortUl.html().trim()==''){
        return
    }
    function getcategoriesList(ele,datas) {

        for(var i=0;i<datas.length;i++){

            var data=datas[i];

            var html='<div class="productsort-subli'+ data.category_id +'" data-node_level="'+ data.category_level +'" data-node_id="'+ data.category_id +'" ><span class="orgs-text">'
                + data.category_name +
                '</span></div>';

            ele.append(html);

            var subEle=$(".productsort-subli"+ data.category_id );
            subEle.wrap('<div class="cate-content"></div>');

            if(data.sub_categories && data.sub_categories.length>0){//递归算法
                if(data.sub_categories){
                    getcategoriesList(subEle,data.sub_categories)
                }
            }
        };

        //初始化select选框数据
        var sortEle=$("#productAdd .product-sort");
        var liFirstNode=$("#productAdd .orgs-text").eq(0);
        var sortFirstId=liFirstNode.parent().attr("data-node_id");

        sortEle.text(liFirstNode.text());
        sortEle.attr("data-category_id",sortFirstId);

        //点击事件绑定
        $(".product-sort").unbind("click").click(function(){//商品分类展开效果
            var $sibUl=$(this).siblings(".productsort-ul");
            var $self=$(this);
            SelectShow($self,$sibUl);
        });

        $("div[class ^='productsort-subli']").unbind("click").click(function(e){//商品分类赋值操作
            e.stopPropagation();
            var self = $(this);
            productFillSelectText(self,".product-sort");
        });
    };
    getcategoriesList(sortUl,datas);*/

    /*new*/
    var datas =$("#dataNode-selectCateProduct").find(".datas").text();
    datas = JSON.parse(datas);
    //定义渲染函数
    var sortUl = $("#everyMenu"),obj = {},objK = 1;
    function getcategoriesList(datas,category_id) {
        obj[objK] = '<div id="'+('M'+category_id)+'" class="mbmenu">'
        $.each(datas,function (i,v) {
            if(this.sub_categories.length>0){
                obj[objK] += '<a category_name="'+this.category_name+'" category_id="'+this.category_id+'" class="clickChoose {menu:'+("'"+'M'+this.category_id+"'")+'}">'+this.category_name+'</a>'
            }else{
                obj[objK] += '<a category_name="'+this.category_name+'" category_id="'+this.category_id+'" class="clickChoose">'+this.category_name+'</a>'
            }
        })
        obj[objK] += '</div>';
        sortUl.append(obj[objK]);
        ++objK;
        $.each(datas,function (i,v) {
            if(this.sub_categories.length>0){
                getcategoriesList(this.sub_categories,this.category_id)
            }
        })
    }
    getcategoriesList(datas,0)
    var eleFlag = $('.product-sort');
    $('.product-sort').on('click',function () {
        eleFlag = $(this)
    })
    $('.clickChoose').on('click',function (e) {
        $(document).click()
        eleFlag.attr('data-category_id',$(this).attr('category_id')).text($(this).attr('category_name'))
    })
    //console.log(obj);


    $(".vertMenu").buildMenu(
        {
            template:"menuVoices.html",
            menuWidth:170,
            openOnBottom:true,
            menuSelector: ".menuContainer",
            hasImages:false,
            fadeInTime:200,
            fadeOutTime:200,
            adjustLeft:0,
            adjustTop:0,
            opacity:.95,
            openOnClick:true,
            minZindex:100000,
            shadow:false,
            hoverIntent:130,
            submenuHoverIntent:130,
            closeOnMouseOut:false
        });
});