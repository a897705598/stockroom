
require.config({
    //urlArgs:'v=0.0.1',
    baseUrl: "/assets/js/scroll",
    paths: {
        "jquery": "jquery.3.2.1.min",
        "iscroll": "iscroll",
        "listloading": "listloading.min",
        "timeConversion": "timeConversion"
    },
    shim: {
        'timeConversion': {
            deps: ['jquery'],
            exports: '$.myTime'
        }
    }
});

