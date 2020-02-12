package com.eshop.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.eshop.dao.RoleDao;
import com.eshop.pojo.Role;
import com.eshop.pojo.UserRole;
import com.eshop.service.RoleService;

@Service("roleService")
@Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.DEFAULT)
public class RoleServiceImpl implements RoleService {
	@Autowired
	RoleDao roleDao;
	
	
	//根据用户Id查找用户角色
	@Override
	public List<String> selectByUserId(int userid){
		return roleDao.selectByUserId(userid);
	}
	
	//保存用户角色关系
	@Override
	 public int saveUserRoleDetail(UserRole userRole) {
		return roleDao.saveUserRoleDetail(userRole);
	}
	
	//查询所有的角色描述
	@Override
	 public List<String> selectAllDescription(){
		return roleDao.selectAllDescription();
	}
	
	//根据角色id出现角色信息
	@Override
	public List<Role> selectRoleByRoleId(long roleid){
		return roleDao.selectRoleByRoleId(roleid);
	}
	
	//查询所有角色信息
	public List<Role> selectAllRoles(){
		return roleDao.selectAllRoles();
	}
	
	//删除角色信息
	public int deleteUserRole(UserRole ur) {
		return roleDao.deleteUserRole(ur);
	}
	
	public int updateUserRole(UserRole ur) {
		return roleDao.updateUserRole(ur);
	}

}
