<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta charset="utf-8" />
    <title>进销存管理系统</title>
    <meta name="description" content="" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!--basic styles-->
    <link href="{{ asset('assets/theme/css/bootstrap.min.css') }}" rel="stylesheet" />
    <link href="{{ asset('assets/theme/css/bootstrap-responsive.min.css') }}" rel="stylesheet" />
    <link rel="stylesheet" href="{{ asset('assets/theme/css/font-awesome.min.css') }}" />
    <!--<link href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">-->

    <!--[if IE 7]>
    <link rel="stylesheet" href="{{asset('assets/theme/css/font-awesome-ie7.min.css') }}" />
    <![endif]-->

    <!--page specific plugin styles-->
    <!--<link rel="stylesheet" href="assets/css/ace-fonts.css" />-->
    <link rel="stylesheet" href="{{ asset('assets/theme/css/datepicker.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/theme/css/daterangepicker.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/theme/css/bootstrap-timepicker.css') }}" />


    <!--ace styles-->
    <link rel="stylesheet" href="{{ asset('assets/theme/css/ace.min.css') }}" />
    <!--<link rel="stylesheet" href="assets/css/ace-skins.min.css" />-->

    <!--[if lte IE 8]>
    <link rel="stylesheet" href="{{asset('assets/theme/css/ace-ie.min.css') }}" />
    <![endif]-->

    <!--ace settings handler-->
    <script src="{{ asset('assets/theme/js/ace-extra.min.js') }}"></script>



    <!--basic scripts-->

    <!--[if !IE]>-->
    <script type="text/javascript">
        window.jQuery || document.write("<script src='{{ asset('assets/theme/js/jquery-2.0.3.min.js') }}'>"+"<"+"/script>");
    </script>
    <!--<![endif]-->

    <!--[if IE]>
    <script type="text/javascript">
        window.jQuery || document.write("<script src='assets/js/jquery-1.10.2.min.js'>"+"<"+"/script>");
    </script>
    <![endif]-->

    <!--page specific plugin scripts-->
    <script src="{{ asset('assets/theme/js/bootstrap.min.js') }}"></script>
    <script src="{{ asset('assets/theme/js/date-time/bootstrap-datepicker.min.js') }}"></script>
    <script src="{{ asset('assets/theme/js/date-time/moment.min.js') }}"></script>
    <script src="{{ asset('assets/theme/js/date-time/daterangepicker.min.js') }}"></script>
    <script src="{{ asset('assets/theme/js/date-time/locales/bootstrap-datepicker.zh-CN.js') }}"></script>
    <script src="{{ asset('assets/theme/js/date-time/bootstrap-timepicker.min.js') }}"></script>

    <script src="{{ asset('assets/js/flieUploadJs/jquery.ui.widget.js') }}"></script>
    <script src="{{ asset('assets/js/flieUploadJs/jquery.iframe-transport.js') }}"></script>
    <script src="{{ asset('assets/js/flieUploadJs/jquery.fileupload.js') }}"></script>

    <script src="{{ asset('assets/js/print/jQuery.print.min.js') }}" ></script>


    <!--ace scripts-->
    <script src="{{ asset('assets/theme/js/ace-elements.min.js') }}"></script>
<!--<script src="{{ asset('assets/theme/js/ace.min.js') }}"></script>-->

    <!--zs add -->
    <script src="{{ asset('assets/js/common.js') }}" ></script>
{{--<script src="{{ asset('assets/js/right.js') }}" ></script>--}}

<!--zs 添加的css文件-->
    <link rel="stylesheet" href="{{ asset('assets/css/theme.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/css/crm.css') }}?v=1" />
{{--<link rel="stylesheet" href="{{ asset('assets/css/iframe.css') }}" />--}}
<!--cc 添加的css、js文件-->
    <link rel="stylesheet" href="{{ asset('assets/css/base.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/css/other.css?v=1') }}" />
    <link rel="stylesheet" href="{{ asset('assets/css/iframe.css?v=1') }}" />
    <script src="{{ asset('assets/js/controller.js') }}" ></script>
    <script src="{{ asset('assets/js/right.js') }}" ></script>
    <style>
        body{overflow-y:auto}
    </style>

</head>
<body>
<!--右侧的管理内容-->
<!--<div class="page-content">-->
<div class="page-content">
    <div class="blue-table">
        <div class="table-header">
            <button class="btn blue btn-add">+ 添加</button>

        </div>
        <table class="table table-striped table-bordered table-hover">
            <thead>
            <tr>
                <th>仓库ID</th>
                <th>仓库名称</th>
                <th>创建时间</th>
                <th>修改时间</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            @if(isset($stockrooms))
                @foreach($stockrooms as $stockroom)
                    <tr>
                        <td class="id">{{ $stockroom->stockroom_id }}</td>
                        <td class="name">{{ $stockroom->stockroom_name }}</td>
                        <td>{{ $stockroom->created_at }}</td>
                        <td>{{ $stockroom->updated_at }}</td>
                        <td>
                            <a href="javascript:void(0);" class="btn-edit">编辑</a>
                            <a href="javascript:void(0);" class="btn-del">删除</a>
                            <a href="javascript:void(0)" class="btn-bind">关联的主体</a>
                        </td>
                        <td class="depts" style="display: none">{{ $stockroom->depts }}</td>
                    </tr>
                @endforeach
            @endif
            </tbody>
        </table>
    </div>
</div>
@include('stockroom.addStockroom')
@include('stockroom.confirm')
@include('stockroom.stockroomBindDept')
<script>
    $(function () {
        $('.btn-add').unbind('click').click(function () {
            showModal('#stockroomAddModal', '添加');
            $('.add-stockroom').unbind('click').click(function () {
                let data = {
                    stockroom_name : $('.stockroom-name').val()
                };
                ajaxRequest('add', 'POST', data, success, ajaxError);
            })
        });
        $('.btn-del').unbind('click').click(function () {
            showModal('#confirmModal');
            let id = $(this).parents('tr').find('.id').text();
            $('.btn-confirm').unbind('click').click(function () {
                let data = {
                    stockroom_id : id
                };
                ajaxRequest('delete', 'POST', data, success, ajaxError);
            })
        });
        $('.btn-bind').unbind('click').click(function () {
            let depts = $(this).parents('tr').find('.depts').text();
            showModal('#stockroomBindDept');
            $('.bind-dept').val(depts);
            let id = $(this).parents('tr').find('.id').text();
            $('.bind-stockroom-dept').unbind('click').click(function () {
                let data = {
                    stockroom_id: id,
                    dept_id: $('.bind-dept').val()
                };
                $.ajax({
                    url: '../dept/bindStockroom',
                    type: 'POST',
                    data: data,
                    dataType: 'JSON',
                    success: function (response, status, xhr) {
                        success(response);
                    },
                    error: function (xhr, errorText, errorType) {
                        ajaxError(errorType);
                    },
                    timeout: 3000
                })
            })
        });
        $('.btn-edit').unbind('click').click(function () {
            clearFromData('#stockroomAddModal');
            showModal('#stockroomAddModal');
            let id = $(this).parents('tr').find('.id').text();
            let name = $(this).parents('tr').find('.name').text();
            $('.stockroom-name').val(name);
            $('.add-stockroom').unbind('click').click(function () {
                let data = {
                    stockroom_id: id,
                    stockroom_name: $('.stockroom-name').val()
                };
                $.ajax({
                    url: 'edit',
                    type: 'POST',
                    data: data,
                    dataType: 'JSON',
                    success: function (response, status, xhr) {
                        success(response);
                    },
                    error: function (xhr, errorText, errorType) {
                        ajaxError(errorType);
                    },
                    timeout: 3000
                })
            })
        });
        function success(res) {
            alert(res.info);
            window.location.reload();
        }
        function ajaxError(res) {
            console.log(res);
            alert(res.info);
        }
    })
</script><!--</div>-->

<script>
    $(document).ready(function() {

        //表格的批量选择
        $('table th input:checkbox').on('click' , function(){
            var that = this;
            $(this).closest('table').find('tr > td:first-child input:checkbox')
                .each(function(){
                    this.checked = that.checked;
                    $(this).closest('tr').toggleClass('selected');
                });
        });

        document.onkeypress = enterPress;
        document.onkeydown = enterPress;
        document.onkeyup = enterPress;

        function enterPress(e) {
            var e = e || event;
            if(e.which && e.which == 13){
                return false;
            }else if(e.keyCode && e.keyCode == 13){
                return false;
            }
        };
    });

</script>
</body>
</html>