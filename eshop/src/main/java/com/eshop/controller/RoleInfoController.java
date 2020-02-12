package com.eshop.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.eshop.common.AssembleResponseMsg;
import com.eshop.pojo.ResponseBody;
import com.eshop.pojo.Role;
import com.eshop.pojo.UserInfo;
import com.eshop.service.RoleService;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

@RestController
@RequestMapping("/role")
public class RoleInfoController {
	@Autowired
    private RoleService roleService;
	
	
	//获取所有角色描述
	@RequestMapping(value ="/getDescriptions",produces = "application/json;charset=utf-8")
	public ResponseBody getRoleInfo(){
		Map<String,Object> roleMap = new HashMap<>();
		//List<String> listOfDescription = roleService.selectAllDescription();
		//System.out.println(listOfDescription);
		//roleMap.put("descriptions",listOfDescription);
		//roleMap.put("rolesList", listOfDescription);
		List<Role> listAllRoles = roleService.selectAllRoles();
		roleMap.put("rolesList", listAllRoles);
		return new AssembleResponseMsg().success(roleMap);
	}
	
	//修改用户角色关系
	
	/*
	 * public ResponseBody updateUserRole(@RequestBody Map<String,Object> map) {
	 * UserInfo userInfo =new UserInfo(); Object user =map.get("userInfo"); //String
	 * roleIds = (String)map.get("roleIds"); //System.out.println("map=" + map);
	 * Map<String,Object> childMap = new HashMap<>();
	 * System.out.println("开始更新用户角色。。。。。。。。。。。"); System.out.println("map=" + map);
	 * System.out.println("userInfo=" + userInfo); //System.out.println("roleIds="
	 * +roleIds); return new AssembleResponseMsg().success("OK"); }
	 */
	
	/*public ResponseBody updateUserRole(@RequestParam(value="userInfo")UserInfo ui) {
		
		System.out.println("userInfo=" + ui);
		//System.out.println("roleIds=" +roleIds);
		return new AssembleResponseMsg().success("OK");
	}*/
	@RequestMapping(value ="/updateUserRole",produces = "application/json;charset=utf-8")
	public ResponseBody updateUserRole(String userInfo, String roleIds)throws JsonParseException, JsonMappingException, IOException {
		try {
			System.out.println("JSON数据转换开始。。。。。。。。。。");
			// 创建ObjectMapper对象,实现JavaBean和JSON的转换
			ObjectMapper mapper = new ObjectMapper();
			// 设置输入时忽略在JSON字符串中存在但Java对象实际没有的属性
			mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
			mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			System.out.println(userInfo);
			System.out.println(roleIds);
			//UserInfo ui = mapper.readValue(userInfo, UserInfo[].class)[0];
			//System.out.println(ui);
			return new AssembleResponseMsg().success("OK");
		}catch (Exception e) {
			System.out.println(e);
			return new AssembleResponseMsg().failure(200,"1003","JSON数据转换失败");
		}
  }
}