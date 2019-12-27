package com.eshop.pojo;
import java.io.Serializable;
import com.eshop.common.DateUtil;
public class ResponseBody<T> implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String date = DateUtil.getCurrentDateStr("yyyy-MM-dd HH:mm:ss");
	private int status = 200;	//状态码，默认200响应成功
	private T data;				//接口返回的数据
	private InfoMsg info;		//消息内容
	
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public int getStatus() {
		return status;
	}
	
	public void setStatus(int status) {
		this.status = status;
	}
	
	public T getData() {
		return data;
	}
	
	public void setData(T data) {
		this.data = data;
	}
	
	public InfoMsg getInfo() {
		return info;
	}
	
	public void setInfo( InfoMsg info) {
		this.info = info;
	}
}
