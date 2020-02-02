package com.eshop.service;

import java.util.List;

import com.eshop.pojo.Role;
import com.eshop.pojo.UserRole;

public interface RoleService {
	public List<String> selectByUserId(int userid);
    public List<Role> selectRoleByUserId(int userid);
    public List<UserRole> selectUserRoleByUserId(int userid);
}
