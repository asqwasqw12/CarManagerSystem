package com.eshop.dao;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.eshop.pojo.Role;
import com.eshop.pojo.UserRole;




public interface RoleDao {
	
	//根据用户id查询用户角色
	@Select("select rolename from sys_role where roleid in (select roleid from user_role where userid = #{userid} )")
    public List<String> selectByUserId(int userid);
	
	//查询所有角色描述
		@Select("select description from sys_role" )
	    public List<String> selectAllDescription();
	
	
	
	//根据角色id查询角色信息
	@Select("select * from sys_role where roleid = #{roleid}")
    public List<Role> selectRoleByRoleId(long roleid);
	
	//查询所有角色信息
	@Select("select * from sys_role")
	public List<Role> selectAllRoles();
	
	//保存用户角色关系
		@Insert("insert into user_role(userid,roleid) values(#{userid},#{roleid})")
		@Options(useGeneratedKeys = true,keyProperty = "userroleid")
		int saveUserRoleDetail(UserRole userRole);
	
	//更新用户角色信息
	@Update("update user_role set userid=#{userid},roleid=#{roleid} where userroleid=#{userroleid}")
	public int updateUserRole(UserRole ur);
	
	//删除用户角色信息
	@Delete("delete from user_role where userid=#{userid} and roleid=#{roleid}")
	public int deleteUserRole(UserRole ur);
}
