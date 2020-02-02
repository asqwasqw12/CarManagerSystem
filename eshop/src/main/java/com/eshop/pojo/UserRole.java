package com.eshop.pojo;

public class UserRole {

	private long userroleid;		//用户角色id
	private int userid;				//用户id
	private long roleid;			//角色id
	
	public void setUserRoleId(long userRoleId) {
		this.userroleid = userRoleId;
	}
	public long getUserRoleIdd() {
		return userroleid;
	}
	public void setRoleId(long roleId) {
		this.roleid = roleId;
	}
	public long getRoleId() {
		return roleid;
	}
	public void setUserId(int userId) {
		this.userid = userId;
	}
	public int getUserId() {
		return userid;
	}
}
