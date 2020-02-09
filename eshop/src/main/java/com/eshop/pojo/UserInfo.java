package com.eshop.pojo;
import java.io.Serializable;

public class UserInfo implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int id;                  //id
	private String userName;         //用户名
	private String password;         //密码
	private String realName;		 //真实姓名
	private String sex;				 //性别
	private String address;			 //地址
	private String email;			 //邮箱
	private String regdate;			 //注册日期
	private int status;				 //状态
    private String roles;			 //角色
    private String departmentname;   //部门
    private String post;			//职务
    private String mobilephone;		//手机号码
    public String getRoles() {
    	return roles;
    }
    
    public void setRoles(String roles) {
    	this.roles = roles;
    }
    
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRegdate() {
		return regdate;
	}

	public void setRegdate(String regdate) {
		this.regdate = regdate;
	}

	public int getStatus() {
		return status;
	}
	
	public void setDepartmentname(String departmentname) {
		this.departmentname = departmentname;
	}
	
	public String getDepartmentname() {
		return this.departmentname;
	}
	public void setPost(String post) {
		this.post = post;
	}
	
	public String getPost() {
		return this.post;
	}

	public void setStatus(int status) {
		this.status = status;
	}
	public String getMobilephone() {
		return mobilephone;
	}
	public void setMobilephone(String Mobilephone) {
		this.mobilephone = Mobilephone;
	}
	
	@Override
	public String toString() {
		return "UserInfo{" +
	           "id='" + id + '\'' +
	           ",userName='" + userName + '\'' +
	           ",password='" + password + '\'' +
	           ",realName='" + realName + '\'' +
	           ",regdate='" + regdate +
	           '}';
	}
}

