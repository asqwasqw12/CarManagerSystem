package com.eshop.dao;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.eshop.pojo.UserRole;

public interface UserRoleDao {
	   //根据用户id查询所有关系表
		@Select("select * from user_role where userid=#{userid}")
		public List<UserRole> selectAllbyUserId(int userid);
		
		//更新用户角色信息
		@Update("update user_role set roleid=#{roleid} where roleid=#{roleid} and userid=#{userid}")
		public int updateUserRole(UserRole ur);
		
		//保存用户角色关系
		@Insert("insert into user_role(userid,roleid) values(#{userid},#{roleid})")
		@Options(useGeneratedKeys = true,keyProperty = "userroleid")
		int saveUserRoleDetail(UserRole userRole);
		
		//删除用户角色信息
		@Delete("delete from user_role where userid=#{userid} and roleid=#{roleid}")
		public int deleteUserRole(UserRole ur);
}
