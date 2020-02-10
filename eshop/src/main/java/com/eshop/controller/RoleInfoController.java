package com.eshop.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eshop.common.AssembleResponseMsg;
import com.eshop.pojo.ResponseBody;
import com.eshop.service.RoleService;

@RestController
@RequestMapping("/role")
public class RoleInfoController {
	@Autowired
    private RoleService roleService;
	
	
	//获取所有角色描述
	@RequestMapping(value ="/getDescriptions",produces = "application/json;charset=utf-8")
	public ResponseBody getRoleInfo(){
		Map<String,Object> roleMap = new HashMap<>();
		List<String> listOfDescription = roleService.selectAllDescription();
		System.out.println(listOfDescription);
		roleMap.put("descriptions",listOfDescription);
		return new AssembleResponseMsg().success(roleMap);
	}
    
}
