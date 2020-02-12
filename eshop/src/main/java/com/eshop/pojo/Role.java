package com.eshop.pojo;

public class Role {
	private long roleid;  //角色id
	private String rolename; //角色姓名
	private String description; //角色描述

	public void setRoleId(long roleid) {
		this.roleid = roleid;
	}
	public long getRoleid() {
		return roleid;
	}
	public void setRoleName(String rolename) {
		this.rolename = rolename;
	}
	public String getRoleName() {
		return rolename;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getDescription() {
		return description;
	}
}
