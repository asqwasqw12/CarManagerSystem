package com.eshop.service;

import java.util.List;

import com.eshop.pojo.Role;
import com.eshop.pojo.UserRole;

public interface RoleService {
	public List<String> selectByUserId(int userid);
    public int saveUserRoleDetail(UserRole userRole);
    public List<String> selectAllDescription();
    public List<Role> selectRoleByRoleId(long roleid);
    public List<Role> selectAllRoles();
    public int deleteUserRole(UserRole ur);
    public int updateUserRole(UserRole ur);
}
