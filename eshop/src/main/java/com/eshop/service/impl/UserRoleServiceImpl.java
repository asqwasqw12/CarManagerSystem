package com.eshop.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.eshop.dao.UserRoleDao;
import com.eshop.pojo.UserRole;
import com.eshop.service.UserRoleService;

@Service("userRoleService")
@Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.DEFAULT)
public class UserRoleServiceImpl implements UserRoleService {
	@Autowired
	UserRoleDao userRoleDao;
	
	//根据用户id查询所有关系表
	   @Override
		public List<UserRole> selectAllbyUserId(int userid)
		{
			return  userRoleDao.selectAllbyUserId(userid);
		}
	   
	   //根据用户id查询角色id
	   public List<Long> selectRoleIdByUserId(int userid){
		   return userRoleDao.selectRoleIdByUserId(userid);
	   }
		
		//更新用户角色
		@Override
		public int updateUserRole(UserRole ur) {
			return userRoleDao.updateUserRole(ur);
		}
		
		//保存用户角色关系
		@Override
		 public int saveUserRoleDetail(UserRole userRole) {
			return userRoleDao.saveUserRoleDetail(userRole);
		}
		
		//删除角色信息
		public int deleteUserRole(UserRole ur) {
			return userRoleDao.deleteUserRole(ur);
		}
}
