<?php
Route::group(['prefix'=>'stockroom', 'namespace'=>'Jxc\Controller'], function () {
    Route::get('list', ['uses'=>'StockroomController@stockroomList']);
    Route::post('add', ['uses'=>'StockroomController@addstockroom']);
    Route::post('edit', ['uses'=>'StockroomController@updatestockroom']);
    Route::post('delete', ['uses'=>'StockroomController@deletestockroom']);
});
