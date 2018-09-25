<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Contracts\Routing\ResponseFactory;
use StructuredResponse\StructuredResponse;

class ValidateException extends Exception
{
    use StructuredResponse;

    /**
     * 报告异常
     *
     * @return void
     */
    public function report()
    {
        //
    }

    /**
     * 将异常渲染到 HTTP 响应中。
     *
     * @param  \Illuminate\Http\Request
     * @return void
     */
    public function render($errors)
    {
        $factory = app(ResponseFactory::class);
        return $factory->make($this->genResponse(0,$errors));
    }
}