package com.eshop.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;

import com.eshop.pojo.UserInfo;


public interface UserInfoDao {
	@Select("select count(1) from user_info where userName = #{userName} and password = #{password} ")
    public int queryUser(Map<String,Object> map);
	
	@Select("select * from user_info where id=#{id} ")
	public UserInfo queryUserInfoByid(int id);
	
	@Select("select * from user_info where userName=#{userName} ")
	public UserInfo queryUserInfoByName(String userName);
	
	@Insert("insert into user_info(userName,password,realName,sex,company,departmentname,post,email,mobilephone)"
			+ "values(#{userName},#{password},#{realName},#{sex},#{company},#{departmentname},#{post},#{email},#{mobilephone})")
	@Options(useGeneratedKeys = true, keyProperty = "id")
	public int  saveUserInfo(Map<String,Object> map);
	
	@Select("select * from user_info where status=#{status}")
	@Results({
		@Result(column="gmt_create",property="regdate") })
	public List<UserInfo> queryUserInfoByStatus(int status);
}
