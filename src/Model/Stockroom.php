<?php

namespace Jxc\Model\Basic;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stockroom extends Model
{
    use SoftDeletes;

    protected $table = 'stockrooms';
    protected $dates = ['deleted_at'];
    protected $primaryKey = 'stockroom_id';
    protected $fillable = ['stockroom_name'];

    public function add($params)
    {
        $model = self::fill($params);
        return $model->save();
    }

    public function edit($params)
    {
        $model = self::find($params['stockroom_id']);
        return $model->fill($params)->save();
    }
}
