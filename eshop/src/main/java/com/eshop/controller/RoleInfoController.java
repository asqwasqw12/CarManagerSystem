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
import com.eshop.service.UserInfoService;
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
	@Autowired
	private UserInfoService userInfoService;
	
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
}