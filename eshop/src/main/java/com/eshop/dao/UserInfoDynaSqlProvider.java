package com.eshop.dao;

import org.apache.ibatis.jdbc.SQL;

import com.eshop.pojo.UserInfo;

public class UserInfoDynaSqlProvider {
	public String updateUserInfo(UserInfo ui) {
		return new SQL() {
			{
				UPDATE("user_info");
				if(ui.getUserName() != null) {
					SET("userName = #{userName}");
				}
				if(ui.getAddress() !=null) {
					SET("address = #{address}");
				}
				if(ui.getCompany() !=null) {
					SET("company = #{company}");
				}
				if(ui.getDepartmentname()!=null) {
					SET("departmentname = #{departmentname}");
				}
				if(ui.getEmail()!=null) {
					SET("email = #{email}");
				}
				if(ui.getMobilephone() !=null) {
					SET("mobilephone = #{mobilephone}");
				}
				if(ui.getPassword() !=null) {
					SET("password = #{password}");
				}
				if(ui.getPost() !=null) {
					SET("post = #{post}");
				}
				if(ui.getRealName() !=null) {
					SET("realName = #{realName}");
				}
				if(ui.getSex() !=null) {
					SET("sex = #{sex}");
				}
				if(ui.getStatus()>0) {
					SET("status =#{status}");
				}
				WHERE("id = #{id}");
			}
		}.toString();
	}

}
