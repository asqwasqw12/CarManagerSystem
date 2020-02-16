package com.eshop.dao;
import java.util.List;
import java.util.Map;
import com.eshop.dao.provider.UserInfoDynaSqlProvider;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;

import com.eshop.dao.provider.UserInfoDynaSqlProvider;
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
	
	//更新用户信息
	@UpdateProvider(type = UserInfoDynaSqlProvider.class,method = "updateUserInfo")
	public int updateUserInfo(UserInfo ui);
	
	//分页条件查询用户列表
	@SelectProvider(type = UserInfoDynaSqlProvider.class,method = "queryByPage")
	@Results({
		@Result(column="gmt_create",property="regdate") })
	 public List<UserInfo> queryByPage(Map<String, Object> params);
	
	//条件查询用户总数
	@SelectProvider(type = UserInfoDynaSqlProvider.class,method = "count")
	public Integer count(Map<String, Object> params);
}
