package com.eshop.pojo;

public class Role {
	private long roleid;  //角色id
	private String rolename; //角色姓名
	private String description; //角色描述

	public void setRoleId(long roleId) {
		this.roleid = roleId;
	}
	public long getRoleId() {
		return roleid;
	}
	public void setRoleName(String roleName) {
		this.rolename = roleName;
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
