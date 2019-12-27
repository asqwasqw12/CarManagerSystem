package com.eshop.dao;

import java.util.Map;

import org.apache.ibatis.annotations.Select;

import com.eshop.pojo.UserInfo;

public interface UserInfoDao {
	@Select("select count(1) from user_info where userName = #{userName} and password = #{password} ")
    public int queryUser(Map<String,Object> map);
	
	@Select("select * from user_info where id=#{id} ")
	public UserInfo queryUserInfoByid(int id);
	
	@Select("select * from user_info where userName=#{userName} ")
	UserInfo queryUserInfoByName(String userName);
	
	
}
