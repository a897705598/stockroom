<?php

namespace Jxc\Controller;

use App\Traits\ApiValidator;
use Jxc\Model\Basic\Stockroom;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use StructuredResponse\StructuredResponse;


class StockroomController extends Controller
{
    use StructuredResponse, ApiValidator;

    public function stockroomList()
    {
        $stockrooms = Stockroom::all();
        Log::info($stockrooms);
        return view('stockroom.stockroomList')->with('stockrooms', $stockrooms);
    }

    public function addStockroom(Request $request)
    {
        $inputs = $request->all();
        $this->validateApi($request, ['stockroom_name'=>'required']);
        $res = (new Stockroom())->add($inputs);
        if ($res) {
            return $this->genResponse(1, '添加成功');
        }
        return $this->genResponse(0, '添加失败');
    }

    public function updateStockroom(Request $request)
    {
        $this->validateApi($request, ['stockroom_id'=>'required|exists:stockrooms']);
        $inputs = $request->all();
        $res = (new Stockroom())->edit($inputs);
        if ($res) {
            return $this->genResponse(1, '修改成功');
        }
        return $this->genResponse(0, '修改失败');
    }

    public function deleteStockroom(Request $request)
    {
        $inputs = $request->all();
        $stockroom = Stockroom::find($inputs['stockroom_id']);
        if ($stockroom) {
            $stockroom->delete();
            return $this->genResponse(1, '删除成功');
        }
        return $this->genResponse(0, '删除失败');
    }
}
