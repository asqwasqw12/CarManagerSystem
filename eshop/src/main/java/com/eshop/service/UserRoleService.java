package com.eshop.service;

import java.util.List;
import com.eshop.pojo.UserRole;

public interface UserRoleService {
	    //根据用户id查询所有关系表
		public List<UserRole> selectAllbyUserId(int userid);
		
		//根据用户id查询角色id
		public List<Long> selectRoleIdByUserId(int userid);

		//更新用户角色
		public int updateUserRole(UserRole ur);
		
		//保存用户角色
	    public int saveUserRoleDetail(UserRole userRole);
	    
	    //删除用户角色
	    public int deleteUserRole(UserRole ur);
}
