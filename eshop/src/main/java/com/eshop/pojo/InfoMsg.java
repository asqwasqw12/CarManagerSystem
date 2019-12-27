package com.eshop.pojo;
import java.io.Serializable;

public class InfoMsg implements Serializable {
		
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String code = "0";	//自定错误码，0表示正常运行
	private String message = "操作成功";		//错误信息
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
}
