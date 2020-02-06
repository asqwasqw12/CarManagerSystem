package com.eshop.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import com.eshop.pojo.Role;
import com.eshop.pojo.UserRole;




public interface RoleDao {
	
	//根据用户id查询用户角色
	@Select("select rolename from sys_role where roleid in (select roleid from user_role where userid = #{userid} )")
    public List<String> selectByUserId(int userid);
	
	//保存用户角色关系
	@Insert("insert into user_role(userid,roleid) values(#{userid},#{roleid})")
	@Options(useGeneratedKeys = true,keyProperty = "userroleid")
	int saveUserRoleDetail(UserRole userRole);
	
	@Select("select * from sys_role")
    public List<Role> selectRoleByUserId(int userid);
	
	@Select("select * from user_role")
	public List<UserRole> selectUserRoleByUserId(int userid);
	
}
