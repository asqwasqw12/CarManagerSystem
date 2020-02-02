package com.eshop.pojo;

public class Permission {
	private long permissionid;  //权限id
	private long parentid;		//父权限id
	private String permissionname;		//权限名称
	private String description;			//权限描述
	private int type = 1;					//类型 类型   0：目录   1：菜单   2：按钮
    private int status = 1;					//状态：1有效；2删除
    private int ordernum;		//排序
    
    public void setPermissionId(long permissionId) {
    	this.permissionid = permissionId;
    }
    public long getPermissionId() {
    	return permissionid;
    }
    public void setParentId(long parentId) {
    	this.parentid = parentId;
    }
    public long getParentId() {
    	return parentid;
    }
    public void setPermissionName(String permissionName) {
    	this.permissionname = permissionName;
    }
    public String getPermissionName() {
    	return permissionname;
    }
    public void setDesciption(String description) {
    	this.description = description;
    }
    public String getDescription() {
    	return description;
    }
    public void setType(int type) {
    	this.type = type;
    }
    public int getType() {
    	return type;
    }
    public void setStatus(int status) {
    	this.status = status;
    }
    public int getStatus() {
    	return status;
    }
    public void setOrderNum(int orderNum) {
    	this.ordernum = orderNum;
    }
    public int getOrderNum() {
    	return ordernum;
    }
}
