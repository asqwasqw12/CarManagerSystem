package com.eshop.controller;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.eshop.common.AssembleResponseMsg;
import com.eshop.common.IOUtils;
import com.eshop.common.JwtUtil;
import com.eshop.pojo.ResponseBody;
import com.eshop.pojo.UserInfo;
import com.eshop.service.UserInfoService;
import com.google.code.kaptcha.Constants;
import com.google.code.kaptcha.Producer;

@RestController
public class UserInfoController {

	
	 // @Autowired private Producer producer;
	 
	
	@Autowired
	private UserInfoService userInfoService;

	
	
	/*
	 * @GetMapping("captcha.jpg") public void captcha(HttpServletResponse
	 * response,HttpServletRequest request) throws ServletException,IOException {
	 * System.out.println("验证码后台服务响应了");
	 * response.setHeader("Cache-Control","no-store,no-cache");
	 * response.setContentType("image/jpeg"); System.out.println(producer);
	 * System.out.println("1"); String text = producer.createText(); //生成文字验证码
	 * System.out.println("2"); BufferedImage image = producer.createImage(text);
	 * //生成图片验证码 System.out.println("3");
	 * request.getSession().setAttribute(Constants.KAPTCHA_SESSION_KEY,text);//
	 * 保存验证码到session System.out.println("4"); ServletOutputStream out =
	 * response.getOutputStream(); System.out.println("5");
	 * ImageIO.write(image,"jpg", out); System.out.println("6");
	 * IOUtils.closeQuietly(out);
	 * System.out.println(request.getSession().getAttribute(Constants.
	 * KAPTCHA_SESSION_KEY)); }
	 */
	 

	@RequestMapping(value ="/login",produces = "application/json;charset=utf-8")
	public ResponseBody login(@RequestBody Map<String,Object> map,HttpServletRequest request) {
		System.out.println("用户登录：后台有响应了！");
		int flag = userInfoService.queryUser(map);
		String userName = (String) map.get("userName"); //获取前端传递的用户名
		
		/*
		 * String captcha = (String) map.get("captcha"); //获取前端传递的验证码 //
		 * 从session中获取之前保存的验证码跟前台传来的验证码进行匹配 Object kaptcha =
		 * request.getSession().getAttribute(Constants.KAPTCHA_SESSION_KEY);
		 * if(kaptcha== null){ System.out.println("验证码失效"); return new
		 * AssembleResponseMsg().failure(200,"27","验证码失效"); }
		 * if(!captcha.equals(kaptcha)){ System.out.println("验证码不正确"); return new
		 * AssembleResponseMsg().failure(200,"287","验证码不正确"); }
		 */
		 
		
		
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
			System.out.println("用户名或密码错误1");
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
	@RequestMapping(value ="/register",produces ="application/json;charset=utf-8")
	public  ResponseBody saveRegisterInfo(@RequestBody Map<String,Object> map) {
		System.out.println("注册用户：后台响应了");
		String userName = (String)map.get("userName");
		UserInfo user = userInfoService.queryUserInfoByName(userName);
		if(user ==null) {
		int result = userInfoService.saveUserInfo(map);
		if(result > 0 ) { 
			System.out.println("用户注册成功");
			return new AssembleResponseMsg().success("OK");
		}else {
			System.out.println("用户注册失败");
			return new AssembleResponseMsg().failure(200, "600", "注册失败");
		}
	}else {
		System.out.println("注册失败");
		return new AssembleResponseMsg().failure(200, "601", "已存在该用户名，请重新注册");
	}
}
	@RequestMapping(value = "/logout",produces ="application/json;charset=utf-8")
	public ResponseBody logout(String token) {
		System.out.println("使用token退出登录");
		System.out.println(token);
		if(null != token) {
            boolean result = JwtUtil.verify(token);//验证token是否正确
            	System.out.println("token正常");
            	return new AssembleResponseMsg().success("Ok");
            }else {
            	return new AssembleResponseMsg().failure(200,"2","token错误或者过期");
            }
	}
}
