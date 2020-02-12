package com.eshop.pojo;

public class UserRole {

	private long userroleid;		//用户角色id
	private int userid;				//用户id
	private long roleid;			//角色id
	
	public void setUserRoleId(long userRoleid) {
		this.userroleid = userRoleid;
	}
	public long getUserRoleid() {
		return userroleid;
	}
	public void setRoleId(long roleid) {
		this.roleid = roleid;
	}
	public long getRoleid() {
		return roleid;
	}
	public void setUserId(int userid) {
		this.userid = userid;
	}
	public int getUserid() {
		return userid;
	}
}
