package com.eshop.service.impl;
import com.eshop.dao.UserInfoDao;
import com.eshop.pojo.UserInfo;
import com.eshop.service.UserInfoService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; 

@Service
public class UserInfoServiceImpl implements UserInfoService {
	@Autowired
	private UserInfoDao userInfoDao;
	
	@Override
	public int queryUser(Map<String,Object> map) {
		return userInfoDao.queryUser(map);
	}
	
	@Override
	public UserInfo queryUserInfoByid(int id) {
		return userInfoDao.queryUserInfoByid(id);
	}
	
	@Override
	public UserInfo queryUserInfoByName(String userName) {
		return userInfoDao.queryUserInfoByName(userName);
	}
	
	@Override
	public int saveUserInfo(Map<String,Object> map) {
		return userInfoDao.saveUserInfo(map);
	}
	
	@Override
	public List<UserInfo> queryUserInfoByStatus(int status){
		return userInfoDao.queryUserInfoByStatus(status);
	}
   
	@Override
	public int updateUserInfo(UserInfo ui) {
		return userInfoDao.updateUserInfo(ui);
	}
}
