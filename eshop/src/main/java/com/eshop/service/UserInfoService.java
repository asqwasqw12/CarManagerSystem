package com.eshop.service;
import java.util.List;
import java.util.Map;

import com.eshop.pojo.Pager;
import com.eshop.pojo.UserInfo;

public interface UserInfoService {
 public int queryUser(Map<String,Object> map);
 public UserInfo queryUserInfoByid(int id);
 public UserInfo queryUserInfoByName(String userName);
 public int saveUserInfo(Map<String,Object> map);
 public List<UserInfo> queryUserInfoByStatus(int status);
 public int updateUserInfo(UserInfo ui);
 
 //分页条件查询用户
 public List<UserInfo> queryUserInfo(UserInfo ui,Pager pager);
 
 //条件查询用户总数
 public Integer count(Map<String, Object> params);
 
}
