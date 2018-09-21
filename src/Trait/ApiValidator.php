<?php
/**
 * Created by PhpStorm.
 * User: haoqi
 * Date: 2018/3/27
 * Time: 9:32
 */

namespace App\Traits;

use App\Exceptions\ValidateException;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;

trait ApiValidator{

    use ValidatesRequests;

    public function validateApi(Request $request, array $rules,
                                array $messages = [], array $customAttributes = [])
    {
        $validate = $this->getValidationFactory()
            ->make($request->all(), $rules, $messages, $customAttributes);

        if ($validate->fails()) {
            $this->throwError($validate->errors()->first());
        }
    }

    public function validateArray(array $params, array $rules, array $messages = [], array $customAttributes = [])
    {
        $validate = $this->getValidationFactory()
            ->make($params, $rules, $messages, $customAttributes);

        if ($validate->fails()) {
            $this->throwError($validate->errors()->first());
        }
    }

    protected function throwError($error){
        $exception = new ValidateException();
        $exception->render($error);
        throw $exception;
    }
}