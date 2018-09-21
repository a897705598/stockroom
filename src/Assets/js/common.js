    /**
         * 获取链接后参数
         * @param name 参数名
         * @returns {*} value
         * @constructor
         */
        // function getQueryString(name) {
        //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
        //     var r = window.location.search.substr(1).match(reg);
        //     if (r!=null) return (r[2]); return null;
        // };

        function getQueryString(key){
            var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
            var result = window.location.search.substr(1).match(reg);
            return result?decodeURIComponent(result[2]):null;
        }
       
        //表单验证
        function noticeText(self,res,notice){
            var prs=self.closest(".form-group");
            if(res!=true){
                prs.find(".form-notice").remove();
                prs.append("<div class='span3 form-notice'>"+notice+"</div>")
            }else{
                prs.find(".form-notice").remove();
            }    
        };
        //
        /**
         * 
         * @param {*事件源} self 
         * @param {*提示信息} notice 
         */
        // function validFrom(self,notice){//密码 邮箱 表单验证
        //     if(self.attr("type")=="email" || self.attr("id") == "eamil"){
        //         var Reg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        //     }else if(self.attr("type")=="password" || self.attr("id") == "psd"){
        //         var Reg=/^[a-zA-Z0-9]\w{5,19}$/;
        //     }else if(self.attr("type")=="tel" || self.attr("id") =="tel"){
        //         var Reg=/^1(3|4|5|7|8)\d{9}$/;
        //     }else if(self.attr("id")=="veri-code"){
        //         var Reg=/^\d{6}$/;
        //     };
        //     var val=self.val();
        //     var res=Reg.test(val);
        //     noticeText(self,res,notice);

        // };
        function validFrom(self,sval){//密码 邮箱 表单验证

            if(self.attr("data-input_type")=="email"){

                var Reg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                var notice='邮箱格式不正确';

            }else if(self.attr("data-input_type")=="password"){

                var Reg=/^[a-zA-Z0-9]\w{5,19}$/;
                var notice='密码为6~18位';

            }else if(self.attr("data-input_type")=="telephone"){

                var Reg=/^1(3|4|5|7|8)\d{9}$/;
                var notice='请输入正确手机号';

            }else if(self.attr("data-input_type")=="veri-code"){

                var Reg=/^\d{6}$/;
                var notice='请输入正确验证码';

            }else if(self.attr("data-input_type") == "idnumber"){

                var Reg=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                var notice='请输入正确身份证';

            }else if(self.attr("data-input_type") == "bankcard"){

                var Reg=/\d{15}|\d{19}/;
                var notice='请输入正确的卡号';

            }else{

                noticeText(self,true,'');
            };

            if(Reg != undefined){
                var res=Reg.test(sval);
                noticeText(self,res,notice);                    
            }
        };

        /**
         * 上传图片
         * @param {*input file 的id选择器} uploadId 
         * @param {*上传图片请求的接口} ajaxUrl 
         * @param {*iput的父级 及最后展现样式的呈现块的class/id} uploadbg 
         * @param {*input 上的class} ImgUrl 
         */
        function UploadImg(uploadId,ajaxUrl,uploadbg,ImgUrl){
            $(uploadId).fileupload({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url:ajaxUrl,
                dataType:'text',
                done: function (e, data) {
                    var res=JSON.parse(data.result);
                    var imgsrc=res.data.path;
                    $(uploadbg).css({
                            background:'url('+imgsrc+')',
                            backgroundSize:'100% 100%'
                    });
                    $(this).next().hide();
                    $(ImgUrl).attr('data-imgUrl',imgsrc)
                }
            });
        };


        // 清除input表单
        /**
         * 
         * @param {*需要清除表单的父节点} clearPrsEle 
         */
        function clearFromData(clearPrsEle){
            
            $(clearPrsEle).find("input").val("");

            var selectLen=$(clearPrsEle).find("select").length;
            for(var i=0; i<selectLen; i++){
                var select=$(clearPrsEle).find("select").eq(i);
                select[0].selectedIndex=0;
            };

            $(clearPrsEle).find("textarea").val("");

            $(clearPrsEle).find(".font-box-base").removeClass("font-box-active");
            $(clearPrsEle).find(".form-notice").remove();

        };
        /**
         * 
         * @param {*弹窗的id名} modalName 
         * @param {* 弹窗抬头的标题} title 
         * @param {*显示的文本消息} notice 
         */
        function showModal(modalName,title,notice){//显示弹窗
            $(modalName).find(".modal-title").text(title);
            $(modalName).find(".confirm-notice").html(notice);
            $(modalName).modal("show");
        };

        function hideModal(modalName){
            $(modalName).modal("hide");
        };

        // ajax function
        function ajaxRequest(url,type,data,successFun,errorFun,$self,confirmSelf){
            if(!data.product_id){
                data['product_id']=$(".product-id-data").text();
            };

            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url : url,
                type: type,
                data:data,
                // dataType: 'JSON',
                success: function(res) {
                    if (confirmSelf) {
                        confirmSelf.attr('disabled',false);
                    }
                    if(res.retcode != undefined){
                        if (res.retcode == 1) {
                            successFun(res,$self);

                        }else{
                            errorFun(res);
                        }
                    }else{
                        successFun(res,$self);
                    }

                },
                error: function(res) {
                    if (confirmSelf) {
                        confirmSelf.attr('disabled',false);
                    }
                    errorFun(res);
                }
            });  
        };



        function ajaxError(res){
            alert(res.info);
        };

        //select 选择框显示与否
        function SelectShow($self,$selectContent){
            if($selectContent.is(":visible")){
                $selectContent.slideUp();
            }else{
                $selectContent.slideDown();
            };
        };


        //select 选中
        function SelectedSelect($self){
            var $liParents=$self.parents(".select-content");
            var $selfText=$self.text().trim();
            $self.addClass("active").siblings().removeClass("active");
            $liParents.slideUp();
            $liParents.prev("p").find("i").text($selfText);
            var $LocalLink=window.location.href;
            var $curLink=$LocalLink.split("list")[0];
            var $searchLink=$curLink+"list?page=1&keywords="+$selfText;
            window.location.href=$searchLink;
        };

        function GetLocalLink() {//获取当前界面的地址
            var sLocalLink=window.location.href;
            var reg=/\?/;
            if(reg.test(sLocalLink)){
                var sCurPageLinkPre=sLocalLink.split("?")[0];
            }else{
                var sCurPageLinkPre=sLocalLink;
            };    
            return sCurPageLinkPre;
        };
        function GoToLink(searchValue1,searchValue2,searchValue3,searchValue4,searchValue5,searchValue6,searchValue7,searchValue8,searchValue9,searchValue10,searchValue11,searchValue12) {//这个是用来进行筛选搜索的
            sCurPageLinkPre=GetLocalLink();
                var searchLink=sCurPageLinkPre
                              +"?keyword_name="+searchValue1
                              +'&keyword_identity_number='+searchValue2
                              +'&keyword_start_time='+searchValue3
                              +'&keyword_end_time='+searchValue4
                              +'&keyword_owner_id='+searchValue5
                              +'&keyword_organization_id='+searchValue6
                              +'&keyword_order_status='+searchValue7
                              +'&keyword_state_id='+searchValue8
                              +'&keyword_cellphone='+searchValue9
                              +'&due='+searchValue10
                              +'&expired='+searchValue11
                              +'&orgnazation_name='+searchValue12
                              +"&product_id="+$(".product-id-data").text();
                window.location.href=searchLink;          
        };
    //改变一个字段
        function GoToLinka(searchValue1,searchValue2,searchValue3) {//这个是用来进行筛选搜索的
            sCurPageLinkPre=GetLocalLink();
            var searchLink=sCurPageLinkPre
                +"?keyword_product_id="+searchValue1
                +'&keyword_start_time='+searchValue2
                +'&keyword_end_time='+searchValue3
            window.location.href=searchLink;
        };
        
         function GoToLinkSimple(searchValue1){
            sCurPageLinkPre=GetLocalLink();
            var searchLink=sCurPageLinkPre
                          +"?product_id="+searchValue1;
            window.location.href=searchLink;    
         };


        /**
         * @param {*是一个key + value 的组合搜索对象} keyValues 
         */
        function GoToLinkAll(keyValues) {//这个是用来进行筛选搜索的
            sCurPageLinkPre=GetLocalLink();
            
            var keys = Object.keys(keyValues);
            var keyStrs = '?';
            for(var k=0; k<keys.length; k++){
                var key = keys[k];
                keyStrs = keyStrs + key + '=' + keyValues[key] +'&';
            };
            
            keyStrs = keyStrs.substring(0,keyStrs.lastIndexOf('&'));
            window.location.href = sCurPageLinkPre + keyStrs;
        
        };
        //复选
        function multipleChoice(ele,active){
            $(ele).unbind("click").bind("click",function(){
                if($(this).hasClass(active)){
                    $(this).removeClass(active);
                }else{
                    $(this).addClass(active);
                }
            });
        };
        //单选 
        function singleChoice(ele,active){
            $(ele).unbind("click").bind("click",function(){
                $(this).addClass(active).siblings().removeClass(active);
            });
        };

        /**
         * 获取多个选中节点的ID值 以逗号分割的字符串形式、
         * @param {*获取的节点元素 多个} ele 
         * @param {*自定义的data- 属性 } dataIdEle 
         */
        function idsData(ele,dataIdEle){
                var eles=$(ele);
                var eleIds=""
                for(var r=0; r < eles.length; r++){
                    var ele=eles[r];
                    var eleId=$(ele).attr(dataIdEle);
                    eleIds=eleIds + eleId +',';
                }
                eleIds=eleIds.substring(0,eleIds.lastIndexOf(','));    
                return  eleIds;  
        };
        /**
         * 获取多个选中节点的ID值 数组的形式
         * @param {*获取的节点元素 多个} ele 
         * @param {*自定义的data- 属性 } dataIdEle 
         */
        function idsDataArr(ele,dataIdEle){
                var eles=$(ele);
                var eleIds=[];
                for(var r=0; r < eles.length; r++){
                    var ele=eles[r];
                    var eleId=$(ele).attr(dataIdEle);
                    eleIds.push(eleId);
                }
                // eleIds=eleIds.substring(0,eleIds.lastIndexOf(','));    
                return  eleIds;  
        };

        /**
         * 获取节点的多个text 以/分割拼接文本
         * @param {*获取的元素节点} ele 
         */
        function idsText(ele){
            var eles=$(ele);
            var texts='';
            for(var i=0; i<eles.length; i++){
                var ele=eles[i];
                var text=$(ele).text();

                texts=texts + text +"/";
            };  
            texts=texts.substring(0,texts.lastIndexOf('/'));
            return texts    
        };

        //给id已选中的选项添加active
        /**
         * 
         * @param {*获取的节点} ele 
         * @param {*获取节点存储id的data自定义属性} dataEleId 
         * @param {*当前请求到的ids值} ids 
         */
        function setActiveIds(ele,dataEleId,ids){
            try {
                var Ways=$(ele);
                for(var p=0; p < Ways.length; p++){
                    var Way=Ways[p];
                    var WayId=$(Way).attr(dataEleId);

                    for(var t=0; t < ids.length; t++){
                        var Id=ids[t];
                        if(WayId == Id){
                            $(Way).addClass("font-box-active");
                        }
                    }

                };
            } catch (e) {

            }
        };

        /**
         * 无限分类的文本填充
         * @param {*事件触发源} self 
         * @param {*展示的content部分 及ul部分} prsSibs 
         *//**/
        function productFillSelectText(self,prsSibs){
            var prs=self.parents(".productsort-ul");
            var stext=self.children(".orgs-text").text().trim();
            var nodeId=self.attr('data-node_id');

            prs.siblings(prsSibs).text(stext);
            prs.siblings(prsSibs).attr('data-category_id',nodeId);
            prs.hide();
        };

                
        /**
         * //验证font-box选择框
         * @param {*font-box-base 基于的modal id} modalId 
         * @param {*font-box-base 基于的父级} prsEle 
         */
        function validFontBox(modalId,prsEle){
            var fontBoxs=$(modalId).find(prsEle);
            var fontBoxActiveEle=fontBoxs.find(".font-box-active");
            
            if(fontBoxActiveEle.length <= 0){

                noticeText(fontBoxs,false,"必填字段不能为空");

            }else{
                    noticeText(fontBoxs,true,"");
            };
        };

        /**
         * 
         * @param {*需要验证的节点} ele 
         * @param {*需要验证的节点值} eleVal 
         */
        function validNotNull(eleVal,ele){

            if(eleVal == "" || eleVal == null){
                noticeText(ele,false,"必填字段不能为空");

            }else{
                noticeText(ele,true,"");
            };
        };

    /**
     * 验证数字范围
     */
    function validNumRange(eleVal,ele){
        if(ele.attr('type')=='text'){
            if(eleVal == "" || eleVal == null){
                noticeText(ele,false,"请填入正确内容");
            }else{
                noticeText(ele,true,"");
            };
        }else if(ele.attr('type')=='number'){
            if(eleVal == "" || eleVal == null ||eleVal<ele.attr('min')){
                noticeText(ele,false,"请填入正确内容");
            }else{
                noticeText(ele,true,"");
            };
        }
    };

        //选中一个check 相应的tit选中
        /**
         * 
         * @param {*事件源} self 
         * @param {*所有当前父级下选中的checkbox} allCheckedEle 
         * @param {*父级 tit + checkbox} prs 
         * @param {* tit 节点} titInptEle 
         */
        function chooseCheckBox(self,allCheckedEle,prs,titInptEle){

            var userCompInputs=$(allCheckedEle);

            var titInpt=self.closest(prs).find(titInptEle);
            if(userCompInputs.length >0){

                titInpt.prop('checked',true);
            }else{
                titInpt.prop('checked',false);
            }
        };    

        /**
         * 
         * @param {* 事件源} self 
         * @param {* 事件源及sibEle的父节点} prsEle 
         * @param {* 兄弟节点 需要操作的checkbox的父节点} sibEle 
         */
        function toggleCheckbox(self,prsEle,sibEle){//全选或反选子及checkbox

            var ddInputs = self.closest(prsEle).find( sibEle +" input[type=checkbox]");

            if(self.is(":checked")){
                ddInputs.prop("checked", true);
            }else{
                ddInputs.prop("checked", false);
            };
        };


        //cookie
        function setCookie(cname,cvalue,exdays){//设置cookie
            var d = new Date();
            d.setTime(d.getTime()+(exdays*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            document.cookie = cname + "=" + cvalue + "; " + expires;

        };
        function getCookie(cname){//获取cookie
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) return c.substring(name.length,c.length);
            }
            return "";
        };

        function delCookie(name){
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=getCookie(name);
            if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        }

    /**
     *  dashboard详情盒子显示
     *  @param {* 点击事件参数} b
     */
    //盒子位置显示函数order_summry_ico1
    function box_show(b) {
        console.log(b.dom);
        //盒子移动 设置属性
        $('body .all_tip_box').appendTo($(b.dom))
        $(b.dom).css('position','relative');
        $('.all_tip_box').css({'left':0,'top':'170px','display':'block'});
        $('.all_tip_box_top').css('left',$(b.dom).width()/2+'px')
        //判断弹出框超出body
        if(document.body.style.overflow!="hidden"&&document.body.scroll!="no"&& document.body.scrollWidth>document.body.offsetWidth)
        {
            $('.all_tip_box').css({'left':'-150px','top':'170px','display':'block'});
            $('.all_tip_box_top').css('left',$('.all_tip_box').width()*3/5+'px');
            if(document.body.style.overflow!="hidden"&&document.body.scroll!="no"&& document.body.scrollWidth>document.body.offsetWidth){
                $('.all_tip_box').css({'left':'-250px','top':'170px','display':'block'});
            }
        }
    }

    /*
    * 点击空白处盒子消失
    *
    * */
    //点击其他地方关闭弹窗documen
    function mouse_down_clear(){
        $(document).on('mousedown',function(e){
            if(!($(e.target).parents('.all_tip_box').length>0) && !$(e.target).is($('.dash_icon1_order_summry'))){
                $('.all_tip_box').css('display','none');
            }
        });
    }

    /*
     * iframe里面判断父盒子宽度是否大于一个值
     *
     * */
    function parentWidth(el,num){
        var w = el.width();
        if(w>num){
            return true
        }else{
            return false
        }
    }


