package com.eshop.dao;

import java.util.List;

import org.apache.ibatis.annotations.Select;

import com.eshop.pojo.Role;
import com.eshop.pojo.UserRole;




public interface RoleDao {
	@Select("select rolename from sys_role where roleid in (select roleid from user_role where userid = #{userid} )")
    public List<String> selectByUserId(int userid);
	
	@Select("select * from sys_role")
    public List<Role> selectRoleByUserId(int userid);
	
	@Select("select * from user_role")
	public List<UserRole> selectUserRoleByUserId(int userid);
	
}
