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
	
	
	
	@Override
	public List<String> selectByUserId(int userid){
		return roleDao.selectByUserId(userid);
	}
	
	@Override
	public List<Role> selectRoleByUserId(int userid){
		return roleDao.selectRoleByUserId(userid);
	}
	
	@Override
	public List<UserRole> selectUserRoleByUserId(int userid){
		return roleDao.selectUserRoleByUserId(userid);
	}

}