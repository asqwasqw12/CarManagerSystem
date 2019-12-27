package com.eshop.common;
import com.eshop.pojo.InfoMsg;
import com.eshop.pojo.ResponseBody;
public class AssembleResponseMsg {
	
	//成功返回内容
	public <T>ResponseBody success(T data){
		ResponseBody<T> resp = new ResponseBody<T> ();
		resp.setData(data);
		InfoMsg info = new InfoMsg();
		resp.setInfo(info);
		return resp;
	}
	
	//失败返回内容
	public <T>ResponseBody failure(int status,String errorCode,String message){
		ResponseBody<T> resp = new ResponseBody<T>();
		resp.setStatus(status);
		InfoMsg info = new InfoMsg();
		info.setCode(errorCode);
		info.setMessage(message);
		resp.setInfo(info);
		return resp;
	}
}
