package com.eshop.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eshop.common.AssembleResponseMsg;
import com.eshop.pojo.ResponseBody;
import com.eshop.pojo.UserInfo;
import com.eshop.pojo.UserRole;
import com.eshop.service.UserInfoService;
import com.eshop.service.UserRoleService;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

@RestController
@RequestMapping("/userRole")
public class UserRoleController {
	@Autowired
	private UserInfoService userInfoService;
	@Autowired
	private UserRoleService userRoleService;
	
	@RequestMapping(value ="/updateUserRole",produces = "application/json;charset=utf-8")
	public ResponseBody updateUserRole(String userInfo, String roleIds)throws JsonParseException, JsonMappingException, IOException {
		try {
			System.out.println("JSON数据转换开始。。。。。。。。。。");
			// 创建ObjectMapper对象,实现JavaBean和JSON的转换
			ObjectMapper mapper = new ObjectMapper();
			// 设置输入时忽略在JSON字符串中存在但Java对象实际没有的属性
			mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
			mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
			UserInfo ui = mapper.readValue(userInfo, UserInfo.class);	//String转换成UserInfo
			int userid = ui.getId();		//获取用户id
			List<UserRole> list = userRoleService.selectAllbyUserId(userid);	//获取固定id的所有用户角色关系
			String[] strArr = roleIds.split(","); 
			UserRole userRole =new UserRole();
			userRole.setUserId(userid);
			for(int i=0;i<strArr.length;i++) {
				long roleid = Long.parseLong(strArr[i]);
				userRole.setRoleId(roleid);
				// 根据userId和roleId作为条件，如果更新失败说明数据库无此记录,则需要插入
				if(userRoleService.updateUserRole(userRole)<=0) {
					// 新增操作
					userRoleService.saveUserRoleDetail(userRole);
				}
			}
				//再做删除操作
				for(UserRole ur:list) {
					if(roleIds.indexOf(Long.toString(ur.getRoleid()))==-1) {
						userRoleService.deleteUserRole(ur);
					}
				}	
			userInfoService.updateUserInfo(ui);
			System.out.println(ui);
			return new AssembleResponseMsg().success("OK");
		}catch (Exception e) {
			System.out.println(e);
			return new AssembleResponseMsg().failure(200,"1003","JSON数据转换失败");
		}
  }

}
