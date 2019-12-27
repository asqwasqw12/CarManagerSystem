package com.eshop.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.eshop.common.AssembleResponseMsg;
import com.eshop.common.JwtUtil;
import com.eshop.pojo.ResponseBody;
import com.eshop.pojo.UserInfo;
import com.eshop.service.UserInfoService;

@RestController
public class UserInfoController {

	@Autowired
	UserInfoService userInfoService;

	@RequestMapping(value ="/login",produces = "application/json;charset=utf-8")
	public ResponseBody login(@RequestBody Map<String,Object> map) {
		System.out.println("后台有响应了！");
		int flag = userInfoService.queryUser(map);
		String userName = (String) map.get("userName");
		Map<String,Object> userMap = new HashMap<>();
		if(flag == 1) {
			System.out.println("成功查询用户");
			UserInfo user = userInfoService.queryUserInfoByName(userName);
			if(user != null) {
			int userId = user.getId();
			String token = JwtUtil.sign(user.getUserName(), String.valueOf(user.getId()));
			System.out.println("token is" + token);
			userMap.put("userName",user.getUserName());
			userMap.put("role",user.getRoles());
			userMap.put("token",token);
			return new AssembleResponseMsg().success(userMap);
			}else {
				System.out.println("查询不到该用户");
				return new AssembleResponseMsg().failure(200,"4","查询不到该用户");
			}
		}else{
			System.out.println("用户名或密码错误");
			return new AssembleResponseMsg().failure(200,"1","用户名或密码错误");
	  }
	}
	@RequestMapping(value ="/getUserInfo",produces ="application/json;charset=utf-8")
	public ResponseBody queryUserInfo( String token) {
		System.out.println("使用token查询用户");
		System.out.println(token);
		
		if(null != token) {
            boolean result = JwtUtil.verify(token);//验证token是否正确
            if (result) {
            	System.out.println("token正常");
            	String userName = JwtUtil.getUserName(token);
            	System.out.println(userName);
            	String id = JwtUtil.getUserId(token);
            	System.out.println(id);
            	//token查找到用户id成功
            	if(id != null) {     
            		System.out.println("根据token转换id成功");
            		
            		UserInfo data = userInfoService.queryUserInfoByid(Integer.valueOf(id));
            		if(data !=null) {
            		System.out.println("根据id成功查询用户");
            		return new AssembleResponseMsg().success(data);
            		}else {
            			System.out.println("根据id查找用户失败");
            			return new AssembleResponseMsg().failure(200,"22","无此用户");
            		}
            	}else {
        			System.out.println("使用token转换id失败");
        			return new AssembleResponseMsg().failure(200,"23","使用token转换id失败");
		}
            }else {
			System.out.println("token错误");
			return new AssembleResponseMsg().failure(200,"2","token错误或者过期");
		}
   }else {
	   System.out.println("token=null");
	   return new AssembleResponseMsg().failure(200,"25","错误，token为null");
   }
}
}

